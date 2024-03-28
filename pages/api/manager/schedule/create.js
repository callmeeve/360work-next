import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
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

  let manager;
  try {
    manager = await prisma.manager.findUnique({
      where: {
        userId: decoded.id,
      },
      include: {
        Company: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching manager" });
  }

  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  const { startDate, endDate, days, employeeId, workTimes } = req.body;

  if (!startDate || !endDate || !days || !employeeId || !workTimes) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let employee;
  try {
    employee = await prisma.employee.findUnique({
      where: {
        id: parseInt(employeeId),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching employee" });
  }

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  try {
    const schedule = await prisma.schedule.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        Employee: {
          connect: {
            id: parseInt(employeeId),
          },
        },
        Day: {
          create: days.map((day) => ({
            day: day,
          })),
        },
        WorkTime: {
          create: workTimes.map((workTime) => ({
            startTime: new Date(`${startDate} ${workTime.startTime}`),
            endTime: new Date(`${startDate} ${workTime.endTime}`),
          })),
        },
      },
    });

    return res
      .status(201)
      .json({ message: "Schedule created", data: schedule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating schedule" });
  }
}
