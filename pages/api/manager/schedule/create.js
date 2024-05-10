import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";
import { zonedTimeToUtc } from 'date-fns-tz';

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

  const { startDate, endDate, startTime, endTime, employeeId } = req.body;

  if (!startDate || !endDate || !startTime || !endTime || !employeeId) {
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
    const timeZone = 'Asia/Jakarta';
    const startTimeDate = zonedTimeToUtc(`1970-01-01T${startTime}`, timeZone);
    const endTimeDate = zonedTimeToUtc(`1970-01-01T${endTime}`, timeZone);
    const startDateUtc = zonedTimeToUtc(startDate, timeZone);
    const endDateUtc = zonedTimeToUtc(endDate, timeZone);

    const schedule = await prisma.schedule.create({
      data: {
        startDate: startDateUtc,
        endDate: endDateUtc,
        startTime: startTimeDate,
        endTime: endTimeDate,
        employee: {
          connect: {
            id: parseInt(employeeId),
          },
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
