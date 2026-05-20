import type {
  CreateLaundryBookingInput,
  LaundryAvailabilityQuery
} from "../schemas/booking.schema.js";
import { laundryService } from "../services/laundry.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";

const getUserId = (req: Express.Request) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
  }

  return req.user.id;
};

export const laundryController = {
  availability: asyncHandler(async (req, res) => {
    const slots = await laundryService.availability(req.query as unknown as LaundryAvailabilityQuery);
    res.json({ slots });
  }),

  createBooking: asyncHandler(async (req, res) => {
    const booking = await laundryService.create(getUserId(req), req.body as CreateLaundryBookingInput);
    res.status(201).json({ booking });
  }),

  cancelBooking: asyncHandler(async (req, res) => {
    const booking = await laundryService.cancel(getUserId(req), String(req.params.id));
    res.json({ booking });
  })
};
