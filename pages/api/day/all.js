import { prisma } from "@/config/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let days;
  try {
    days = await prisma.day.findMany();
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve days", error });
  }

  res.status(200).json({ message: "Days retrieved successfully", days });
}
