import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError, isOperationalError } from "../utils/app-error.js";

const isUniqueViolation = (error: Prisma.PrismaClientKnownRequestError) => error.code === "P2002";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`, "ROUTE_NOT_FOUND"));
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.flatten()
      }
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && isUniqueViolation(error)) {
    return res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "The requested resource conflicts with an existing record",
        details: error.meta
      }
    });
  }

  if (isOperationalError(error)) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
  }

  const message = env.NODE_ENV === "production" ? "Internal server error" : (error as Error).message;

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message
    }
  });
};
