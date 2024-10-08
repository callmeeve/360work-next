import { prisma } from "@/config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, secretKey } = req.body;

    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to find user", error });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role === "MANAGER") {
      const manager = await prisma.manager.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!manager || manager.secretKey !== secretKey) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    let isMatch;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (error) {
      return res.status(500).json({ message: "Failed to compare passwords", error });
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let token;
    try {
      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d" // 7 days
        }
      );
    } catch (error) {
      return res.status(500).json({ message: "Failed to sign token", error });
    }

    res.status(200).json({ token, user });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}