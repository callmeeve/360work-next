import { prisma } from "@/config/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export default async function handle(req, res) {
  if (req.method === "POST") {
    const { username, email, password, role } = req.body;

    let userExists;
    try {
      userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to check if user exists", error });
    }

    if (userExists) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    let user;

    try {
      if (role === "MANAGER") {
        const secret_key = crypto.randomBytes(20).toString("hex");

        user = await prisma.user.create({
          data: {
            username: username,
            email: email,
            password: hashedPassword,
            role: role,
            Manager: {
              create: {
                secretKey: secret_key,
                name: username,
              },
            },
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            username: username,
            email: email,
            password: hashedPassword,
            role: role,
          },
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Failed to create user", error });
    }

    let token;
    try {
      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );
    } catch (error) {
      return res.status(500).json({ message: "Failed to sign token", error });
    }

    res
      .status(200)
      .json({ message: "User created successfully", user: user, token: token });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}