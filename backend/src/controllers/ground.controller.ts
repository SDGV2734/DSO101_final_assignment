import type { AvailabilityQuery, CreateGroundBookingInput } from "../schemas/booking.schema.js";
import { groundService } from "../services/ground.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";

const getUserId = (req: Express.Request) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
  }

  return req.user.id;
};

export const groundController = {
  availability: asyncHandler(async (req, res) => {
    const slots = await groundService.availability(req.query as unknown as AvailabilityQuery);
    res.json({ slots });
  }),

  createBooking: asyncHandler(async (req, res) => {
    const booking = await groundService.create(getUserId(req), req.body as CreateGroundBookingInput);
    res.status(201).json({ booking });
  }),

  cancelBooking: asyncHandler(async (req, res) => {
    const booking = await groundService.cancel(getUserId(req), String(req.params.id));
    res.json({ booking });
  })
};
