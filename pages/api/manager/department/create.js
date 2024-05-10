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

  const { name, companyId } = req.body;

  const manager = await prisma.manager.findUnique({
    where: {
      userId: decoded.id,
    },
  });

  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  let department;
  try {
    department = await prisma.department.create({
      data: {
        name: name,
        companyId: companyId,
        company: {
          connect: {
            id: manager.companyId,
          },
        },
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create department", error });
  }

  res
    .status(200)
    .json({ message: "Department created successfully", department });
}
