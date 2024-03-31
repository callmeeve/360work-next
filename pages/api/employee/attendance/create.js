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
        Manager: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching employee" });
  }

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const { image, date, clockIn, clockOut } = req.body;

  // Check if the employee has a schedule for the date
  let schedule;
  try {
    schedule = await prisma.schedule.findFirst({
      where: {
        employeeId: employee.id,
        startDate: { lte: new Date(date) },
        endDate: { gte: new Date(date) },
      },
      include: {
        WorkTime: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching schedule" });
  }

  if (!schedule) {
    return res
      .status(404)
      .json({
        message: "No schedule found for the employee on the given date",
      });
  }

  // Check if clockIn time is within the work time
  const workTime = schedule.WorkTime[0]; // Assuming there is only one work time per schedule
  let status;
  if (!clockIn) {
    status = "ABSENT";
  } else if (new Date(clockIn) < workTime.startTime) {
    status = "PRESENT";
  } else if (new Date(clockIn) === workTime.startTime) {
    status = "PRESENT";
  } else {
    status = "LATE";
  }

  // Create the attendance
  let attendance;
  try {
    attendance = await prisma.attendance.create({
      data: {
        image: image,
        date: new Date(date),
        clockIn: new Date(clockIn),
        status: status,
        employeeId: employee.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating attendance" });
  }

  if (clockOut) {
    // Check if clockOut time is within the work time
    if (new Date(clockOut) < workTime.endTime) {
      status = "LEAVE EARLY";
    } else if (new Date(clockOut) === workTime.endTime) {
      status = "LEAVE";
    } else {
      status = "OVERTIME";
    }

    // Update the attendance
    try {
      attendance = await prisma.attendance.update({
        where: {
          id: attendance.id,
        },
        data: {
          clockOut: new Date(clockOut),
          status: status,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating attendance" });
    }
  }
  return res.status(201).json(attendance);
}
