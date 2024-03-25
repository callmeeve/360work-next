import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import crypto from "crypto";

async function main() {
  const username = "haikal";
  const registerManager = await prisma.user.create({
    data: {
      username: username,
      email: "haikal@example.com",
      password: bcrypt.hashSync("password", 10),
      role: "MANAGER",
      Manager: {
        create: {
          secretKey: crypto.randomBytes(20).toString("hex"),
          name: username,
        },
      },
    },
  });
  const usernameEmployee = "fiki";
  const registerEmployee = await prisma.user.create({
    data: {
      username: usernameEmployee,
      email: "fiki@example.com",
      password: bcrypt.hashSync("password", 10),
      role: "EMPLOYEE",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
