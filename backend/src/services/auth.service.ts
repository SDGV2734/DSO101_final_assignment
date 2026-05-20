import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { AppError } from "../utils/app-error.js";

const sanitizeUser = <T extends { passwordHash: string }>(user: T) => {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

const signAccessToken = (user: { id: string; role: string; email: string }) =>
  jwt.sign({ role: user.role, email: user.email }, env.JWT_SECRET as Secret, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });

export const authService = {
  async register(input: RegisterInput) {
    const passwordHash = await bcrypt.hash(input.password, 12);

    try {
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          studentId: input.studentId,
          passwordHash
        }
      });

      return {
        user: sanitizeUser(user),
        token: signAccessToken(user)
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(409, "Email or student ID is already registered", "USER_ALREADY_EXISTS");
      }

      throw error;
    }
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    return {
      user: sanitizeUser(user),
      token: signAccessToken(user)
    };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    return user;
  }
};
