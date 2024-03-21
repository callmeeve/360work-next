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

  if (decoded.role !== "EMPLOYEE") {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const {
    name,
    address,
    birth_date,
    gender,
    phone,
  } = req.body;

  if (!name || !address || !birth_date || !gender || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const employee = await prisma.employee.findUnique({
    where: {
      userId: decoded.id,
    },
  });

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const updatedEmployee = await prisma.employee.update({
    where: {
      id: employee.id,
    },
    data: {
      name: name,
      address: address,
      birth_date: new Date(birth_date),
      gender: gender,
      phone: phone,
    },
  });

  res
    .status(200)
    .json({ message: "Employee data updated successfully", updatedEmployee });
}