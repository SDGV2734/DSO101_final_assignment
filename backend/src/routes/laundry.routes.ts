import { Router } from "express";
import { laundryController } from "../controllers/laundry.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.js";
import {
  createLaundryBookingSchema,
  idParamSchema,
  laundryAvailabilityQuerySchema
} from "../schemas/booking.schema.js";

export const laundryRouter = Router();

laundryRouter.use(requireAuth);
laundryRouter.get("/availability", validateQuery(laundryAvailabilityQuerySchema), laundryController.availability);
laundryRouter.post("/bookings", validateBody(createLaundryBookingSchema), laundryController.createBooking);
laundryRouter.patch(
  "/bookings/:id/cancel",
  validateParams(idParamSchema),
  laundryController.cancelBooking
);
