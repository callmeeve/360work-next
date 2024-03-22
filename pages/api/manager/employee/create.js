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
      Company: true,
    },
  });

  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  const { username, email, password, job_status, departmentId } = req.body;

  if (!username || !email || !password || !job_status || !departmentId) {
    return res.status(400).json({ message: "Missing required fields" });
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

  if (department.companyId !== manager.Company.id) {
    return res.status(400).json({
      message: "Department does not belong to the same company as the manager",
    });
  }

  const newEmployee = await prisma.employee.create({
    data: {
      job_status: job_status,
      User: {
        connect: {
          id: newUser.id,
        },
      },
      Company: {
        connect: {
          id: manager.Company.id,
        },
      },
      Department: {
        connect: {
          id: parseInt(departmentId),
        },
      },
      Manager: {
        connect: {
          id: manager.id,
        },
      },
    },
  });

  res
    .status(200)
    .json({ message: "Employee created successfully", newEmployee });
}
