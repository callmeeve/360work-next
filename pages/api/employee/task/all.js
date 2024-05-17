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

  let employee;
  try {
    employee = await prisma.employee.findUnique({
      where: {
        userId: decoded.id,
      },
      include: {
        manager: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching employee" });
  }

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const tasks = await prisma.task.findMany({
    where: {
      employeeId: employee.id,
    },
    include: {
      employee: true,
      manager: {
        select: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json(tasks);
}
