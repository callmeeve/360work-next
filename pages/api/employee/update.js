import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";

export default async function handle(req, res) {
  if (req.method !== "PUT") {
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

  const { id, name, address, job_status, phone } = req.body;

  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  if (!employee || employee.userId !== decoded.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this employee" });
  }

  let updatedEmployee;
  try {
    updatedEmployee = await prisma.employee.update({
      where: {
        id,
      },
      data: {
        name,
        address,
        job_status,
        phone,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update employee", error });
  }

  res
    .status(200)
    .json({ message: "Employee updated successfully", updatedEmployee });
}
