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

  if (decoded.role !== "EMPLOYEE") {
    return res.status(403).json({ message: "You are not authorized" });
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        Notification: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching notifications" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user.Notification);
}