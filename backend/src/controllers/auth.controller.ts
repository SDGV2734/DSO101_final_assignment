import type { Response } from "express";
import { env } from "../config/env.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";

const authCookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SECURE ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
} as const;

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("accessToken", token, authCookieOptions);
};

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body as RegisterInput);
    setAuthCookie(res, result.token);
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body as LoginInput);
    setAuthCookie(res, result.token);
    res.json(result);
  }),

  logout: asyncHandler(async (_req, res) => {
    res.clearCookie("accessToken", authCookieOptions);
    res.status(204).send();
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
    }

    const user = await authService.me(req.user.id);
    res.json({ user });
  })
};
