import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { groundRouter } from "./ground.routes.js";
import { laundryRouter } from "./laundry.routes.js";
import { notificationRouter } from "./notification.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "cst-booking-system-api" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/laundry", laundryRouter);
apiRouter.use("/ground", groundRouter);
apiRouter.use("/notifications", notificationRouter);
