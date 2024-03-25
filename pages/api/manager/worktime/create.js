import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";

export default async function handle(req, res) {
  if (req.method !== "POST") {
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

  const manager = await prisma.manager.findUnique({
    where: {
      userId: decoded.id,
    },
  });

  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  const { date, start_time, end_time, employeeId } = req.body;

  console.log({ date, start_time, end_time, employeeId });

  if (!date || !start_time || !end_time || !employeeId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id: parseInt(employeeId),
    },
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const newWorkTime = await prisma.workTime.create({
    data: {
      date: new Date(date),
      start_time: new Date(`${date}T${start_time}Z`),
      end_time: new Date(`${date}T${end_time}Z`),
      Employee: {
        connect: {
          id: employee.id,
        },
      },
    },
  });

  res
    .status(200)
    .json({ message: "WorkTime created successfully", newWorkTime });
}
