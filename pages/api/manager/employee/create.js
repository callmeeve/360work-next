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
      Company: {
        select: {
          id: true,
          Department: true,
        },
      },
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
  } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !job_status
  ) {
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

  const newEmployee = await prisma.employee.create({
    data: {
      job_status: job_status,
      userId: newUser.id,
      companyId: manager.Company.id,
      departmentId: manager.Company.Department.id,
      managerId: manager.id,
    },
  });

  res
    .status(200)
    .json({ message: "Employee created successfully", newEmployee });
}
