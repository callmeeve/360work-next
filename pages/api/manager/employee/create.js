import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    include: {
      company: true,
    },
  });

  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  const {
    username,
    email,
    password,
    job_status,
    departmentId,
    workStart,
    workEnd,
  } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !job_status ||
    !departmentId ||
    !workStart ||
    !workEnd
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate workStart and workEnd format
  const isValidTime = (timeString) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeString);
  };

  if (!isValidTime(workStart) || !isValidTime(workEnd)) {
    return res.status(400).json({ message: "Invalid time format for workStart or workEnd" });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
      role: "EMPLOYEE",
    },
  });

  const department = await prisma.department.findUnique({
    where: {
      id: parseInt(departmentId),
    },
  });

  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  if (department.companyId !== manager.company.id) {
    return res.status(400).json({
      message: "Department does not belong to the same company as the manager",
    });
  }

  const newEmployee = await prisma.employee.create({
    data: {
      job_status: job_status,
      user: {
        connect: {
          id: newUser.id,
        },
      },
      company: {
        connect: {
          id: manager.company.id,
        },
      },
      department: {
        connect: {
          id: parseInt(departmentId),
        },
      },
      manager: {
        connect: {
          id: manager.id,
        },
      },
    },
  });

  // Construct full date-time strings from current date and provided time values
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in ISO format
  const start = new Date(`${currentDate}T${workStart}:00`).toISOString();
  const end = new Date(`${currentDate}T${workEnd}:00`).toISOString();

  try {
    const attendance = await prisma.attendance.create({
      data: {
        employeeId: newEmployee.id,
        workStart: start,
        workEnd: end,
        status: null,
      },
    });

    return res.status(200).json({
      message: "Employee and attendance created successfully",
      newEmployee,
      attendance,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating attendance record" });
  }
}
