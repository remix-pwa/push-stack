import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../server/db.server";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      image: true,
      description: true,
    },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      image: true,
      description: true,
    },
  });
}

export async function createUser(
  username: User["username"],
  email: User["email"],
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username: username,
      image: `https://api.dicebear.com/7.x/identicon/png?seed=${Buffer.from(
        email
      ).toString("hex")}`,
    },
  });
}

export async function verifyLogin(email: User["email"], password: string) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
