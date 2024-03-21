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

  if (decoded.role !== "MANAGER") {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const { id, job_status, departmentId } = req.body;

  const manager = await prisma.manager.findUnique({
    where: {
      userId: decoded.id,
    },
  });

  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  if (!manager || !employee || manager.companyId !== employee.companyId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this employee" });
  }

  const department = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
  });

  if (!department || department.companyId !== manager.companyId) {
    return res.status(400).json({ message: "Invalid department" });
  }

  let updatedEmployee;
  try {
    updatedEmployee = await prisma.employee.update({
      where: {
        id,
      },
      data: {
        job_status,
        departmentId,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update employee", error });
  }

  res.status(200).json({ message: "Employee updated successfully", updatedEmployee });
}