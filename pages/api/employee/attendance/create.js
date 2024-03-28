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

  const { image, date } = req.body;

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

  // Get the employee's schedule based on their manager
  const schedule = await prisma.schedule.findFirst({
    where: {
      employeeId: employee.managerId,
      startDate: { lte: new Date(date) },
      endDate: { gte: new Date(date) },
    },
    include: {
      WorkTime: true,
    },
  });

  if (!schedule) {
    return res.status(400).json({ error: 'No schedule found for this date.' });
  }

  // Check if the employee has already clocked in today
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: {
        gte: new Date(date).setHours(0, 0, 0, 0),
        lt: new Date(date).setHours(24, 0, 0, 0),
      },
    },
  });

  if (!existingAttendance) {
    // If the employee hasn't clocked in yet, create a new attendance record
    const newAttendance = await prisma.attendance.create({
      data: {
        image,
        date: new Date(date),
        clockIn: new Date(date),
        status: 'PRESENT',
        employeeId: employee.id,
      },
    });

    return res.status(200).json(newAttendance);
  } else {
    // If the employee has already clocked in, update the existing attendance record with the clock-out time
    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: existingAttendance.id,
      },
      data: {
        clockOut: new Date(date),
      },
    });

    // Check if the employee is late or overtime
    const startTime = new Date(schedule.WorkTime[0].startTime);
    const endTime = new Date(schedule.WorkTime[0].endTime);
    let status = 'PRESENT';

    if (req.body.expectedStatus === 'SICK') {
      status = 'SICK';
    } else if (!existingAttendance) {
      status = 'ABSENT';
    } else if (updatedAttendance.clockIn > startTime) {
      status = 'LATE';
    } else if (updatedAttendance.clockIn.getTime() === startTime.getTime()) {
      status = 'PRESENT';
    }

    if (updatedAttendance.clockOut > endTime) {
      status = 'OVER_TIME';
    } else if (updatedAttendance.clockOut.getTime() === endTime.getTime()) {
      status = 'LEAVE';
    }

    // Update the attendance status
    const finalAttendance = await prisma.attendance.update({
      where: {
        id: existingAttendance.id,
      },
      data: {
        status,
      },
    });

    return res.status(200).json(finalAttendance);
  }
}