import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface UserContext {
      id: string;
      role: UserRole;
      email: string;
    }

    interface Request {
      user?: UserContext;
    }
  }
}

export {};
