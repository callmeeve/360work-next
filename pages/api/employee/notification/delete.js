import { prisma } from "@/config/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
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

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Notification ID is required" });
  }

  let notification;
  try {
    notification = await prisma.notification.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting notification" });
  }

  return res.status(200).json(notification);
}
