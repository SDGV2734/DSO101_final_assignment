import { BookingStatus, Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import type { AvailabilityQuery, CreateGroundBookingInput } from "../schemas/booking.schema.js";
import { AppError } from "../utils/app-error.js";
import { addMinutes, buildHourlySlots, getDateBounds, parseBookingStart } from "../utils/time-slots.js";

const SLOT_MINUTES = 60;

export const groundService = {
  async availability(query: AvailabilityQuery) {
    const { start, end } = getDateBounds(query.date);
    const bookings = await prisma.groundBooking.findMany({
      where: {
        groundName: env.GROUND_RESOURCE_NAME,
        status: BookingStatus.ACTIVE,
        startsAt: {
          gte: start,
          lt: end
        }
      },
      select: { startsAt: true }
    });

    const takenStarts = new Set(bookings.map((booking) => booking.startsAt.toISOString()));
    return buildHourlySlots(query.date, takenStarts);
  },

  async create(userId: string, input: CreateGroundBookingInput) {
    const startsAt = parseBookingStart(input.startsAt);
    const endsAt = addMinutes(startsAt, SLOT_MINUTES);

    try {
      return await prisma.$transaction(
        async (tx) => {
          const booking = await tx.groundBooking.create({
            data: {
              userId,
              groundName: env.GROUND_RESOURCE_NAME,
              startsAt,
              endsAt
            }
          });

          await tx.notification.create({
            data: {
              userId,
              title: "Ground booking confirmed",
              message: `Your football ground slot is confirmed for ${startsAt.toISOString()}.`,
              metadata: {
                bookingType: "ground",
                bookingId: booking.id
              }
            }
          });

          return booking;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(409, "This ground slot has already been booked", "SLOT_UNAVAILABLE");
      }

      throw error;
    }
  },

  async cancel(userId: string, bookingId: string) {
    const booking = await prisma.groundBooking.findFirst({
      where: { id: bookingId, userId }
    });

    if (!booking) {
      throw new AppError(404, "Ground booking not found", "BOOKING_NOT_FOUND");
    }

    if (booking.status !== BookingStatus.ACTIVE) {
      throw new AppError(400, "Only active bookings can be cancelled", "BOOKING_NOT_ACTIVE");
    }

    if (booking.startsAt <= new Date()) {
      throw new AppError(400, "Bookings cannot be cancelled after they start", "CANCELLATION_WINDOW_CLOSED");
    }

    const updated = await prisma.groundBooking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date()
      }
    });

    await prisma.notification.create({
      data: {
        userId,
        title: "Ground booking cancelled",
        message: `Your football ground booking for ${booking.startsAt.toISOString()} has been cancelled.`,
        metadata: {
          bookingType: "ground",
          bookingId: booking.id
        }
      }
    });

    return updated;
  }
};
