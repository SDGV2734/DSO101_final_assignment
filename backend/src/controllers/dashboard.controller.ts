import { dashboardService } from "../services/dashboard.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";

export const dashboardController = {
  getDashboard: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
    }

    const dashboard = await dashboardService.getStudentDashboard(req.user.id);
    res.json({ dashboard });
  })
};
