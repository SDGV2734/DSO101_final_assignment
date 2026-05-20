import { notificationService } from "../services/notification.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";

export const notificationController = {
  list: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
    }

    const notifications = await notificationService.listForUser(req.user.id);
    res.json({ notifications });
  }),

  markAsRead: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
    }

    await notificationService.markAsRead(req.user.id, String(req.params.id));
    res.status(204).send();
  })
};
