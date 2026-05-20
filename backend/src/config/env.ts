import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
    COOKIE_SECURE: z.coerce.boolean().default(false),
    LAUNDRY_RESOURCE_COUNT: z.coerce.number().int().positive().default(4),
    GROUND_RESOURCE_NAME: z.string().min(1).default("CST Football Ground")
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && env.JWT_SECRET.includes("replace-this")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["JWT_SECRET"],
        message: "Use a strong production JWT secret"
      });
    }
  });

export const env = envSchema.parse(process.env);
