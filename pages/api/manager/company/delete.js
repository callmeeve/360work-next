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

  const { id, name, address, city, state, zip, phone } = req.body;

  const manager = await prisma.manager.findUnique({
    where: {
      userId: decoded.id,
    },
  });

  if (!manager || manager.companyId !== id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this company" });
  }

  let company;
  try {
    company = await prisma.company.update({
      where: {
        id,
      },
      data: {
        name,
        address,
        city,
        state,
        zip,
        phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update company", error });
  }

  res.status(200).json({ message: "Company updated successfully", company });
}