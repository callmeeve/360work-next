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

  const { image, date, checkIn, checkOut } = req.body;

  //Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the date is not today
  if (new Date(date).getTime() !== today.getTime()) {
    return res
      .status(400)
      .json({ message: "Attendance can only be made for today" });
  }

  // Determine the attendance status based on checkIn
  let status;
  if (!checkIn) {
    status = "ABSENT";
  } else if (new Date(checkIn) < schedule.startTime) {
    return res.status(400).json({
      message:
        "Check-in time cannot be earlier than the start time in the schedule",
    });
  } else if (new Date(checkIn) > schedule.startTime) {
    status = "LATE";
  } else {
    status = "PRESENT";
  }

  // Check if the employee has already checked in for the date
  let attendance;
  try {
    attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: new Date(date),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching attendance" });
  }

  // If the employee has not checked in yet, create a new attendance entry
  if (!attendance) {
    try {
      await prisma.attendance.create({
        data: {
          image,
          date: new Date(date),
          checkIn: checkIn ? new Date(checkIn) : null,
          status, // use the determined status
          employeeId: employee.id,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error creating attendance" });
    }
  } else {
    // If the employee has already checked in, update the attendance entry with checkOut
    if (checkOut) {
      if (new Date(checkOut) > schedule.endTime) {
        status = "OVERTIME";
      } else if (new Date(checkOut) < schedule.endTime) {
        status = "LEAVE_EARLY";
      } else {
        status = "LEAVE";
      }

      try {
        await prisma.attendance.update({
          where: {
            id: attendance.id,
          },
          data: {
            checkOut: new Date(checkOut),
            status, // update the status if necessary
          },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating attendance" });
      }
    }
  }

  return res.status(201).json({ message: "Attendance created or updated" });
}
