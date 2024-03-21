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

  if (decoded.role !== "MANAGER") {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const { id, name } = req.body;

  const department = await prisma.department.findUnique({
    where: {
      id,
    },
    include: {
      Company: {
        select: {
          Manager: true,
        },
      },
    },
  });

  if (
    !department ||
    !department.Company.Manager ||
    department.Company.Manager.userId !== decoded.id
  ) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this department" });
  }

  let updatedDepartment;
  try {
    updatedDepartment = await prisma.department.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update department", error });
  }

  res
    .status(200)
    .json({ message: "Department updated successfully", updatedDepartment });
}
