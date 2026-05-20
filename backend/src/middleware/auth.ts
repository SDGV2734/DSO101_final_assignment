import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

type JwtPayload = {
  sub: string;
  role: Express.UserContext["role"];
  email: string;
};

const getTokenFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  return req.cookies?.accessToken as string | undefined;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email
    };
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token", "INVALID_TOKEN");
  }
};
