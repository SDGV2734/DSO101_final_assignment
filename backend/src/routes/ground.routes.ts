import { Router } from "express";
import { groundController } from "../controllers/ground.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.js";
import {
  availabilityQuerySchema,
  createGroundBookingSchema,
  idParamSchema
} from "../schemas/booking.schema.js";

export const groundRouter = Router();

groundRouter.use(requireAuth);
groundRouter.get("/availability", validateQuery(availabilityQuerySchema), groundController.availability);
groundRouter.post("/bookings", validateBody(createGroundBookingSchema), groundController.createBooking);
groundRouter.patch("/bookings/:id/cancel", validateParams(idParamSchema), groundController.cancelBooking);
