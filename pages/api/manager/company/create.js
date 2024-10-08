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

  const { name, email, address } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({ message: "Name, email, and address are required" });
  }

  const manager = await prisma.manager.findUnique({
    where: {
      userId: decoded.id,
    },
  });

  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  let company;
  try {
    company = await prisma.company.create({
      data: {
        name,
        email,
        address,
        manager: {
          connect: {
            id: manager.id,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create company", error });
  }

  res.status(200).json({ message: "Company created successfully", company });
}