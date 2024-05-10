import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = req.headers.authorization.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (decoded.role !== "MANAGER") {
    return res.status(403).json({ message: "You are not authorized" });
  }

  let manager;
  try {
    manager = await prisma.manager.findUnique({
      where: {
        userId: decoded.id,
      },
      include: {
        company: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching manager" });
  }

  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  let schedules;
  try {
    schedules = await prisma.schedule.findMany({
      include: {
        employee: true,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve schedules", error });
  }

  res
    .status(200)
    .json({ message: "Schedules retrieved successfully", schedules });
}
