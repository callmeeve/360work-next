import { prisma } from "@/config/db";
import manager from "@/pages/manager";
import company from "@/pages/manager/company";
import jwt from "jsonwebtoken";

export default async function handle(req, res) {
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

  let departments;
  try {
    departments = await prisma.department.findMany({
      where: {
        company: {
          manager: {
            some: {
              userId: decoded.id,
            },
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve departments", error });
  }

  res
    .status(200)
    .json({ message: "Departments retrieved successfully", departments });
}