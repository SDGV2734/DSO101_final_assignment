import { BookingStatus, Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import type { CreateLaundryBookingInput, LaundryAvailabilityQuery } from "../schemas/booking.schema.js";
import { AppError } from "../utils/app-error.js";
import { addMinutes, buildHourlySlots, getDateBounds, parseBookingStart } from "../utils/time-slots.js";

const SLOT_MINUTES = 60;

export const laundryService = {
  async availability(query: LaundryAvailabilityQuery) {
    if (query.resourceNumber > env.LAUNDRY_RESOURCE_COUNT) {
      throw new AppError(400, `Only ${env.LAUNDRY_RESOURCE_COUNT} laundry resources are configured`, "INVALID_RESOURCE");
    }

    const { start, end } = getDateBounds(query.date);
    const bookings = await prisma.laundryBooking.findMany({
      where: {
        resourceType: query.resourceType,
        resourceNumber: query.resourceNumber,
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

  async create(userId: string, input: CreateLaundryBookingInput) {
    if (input.resourceNumber > env.LAUNDRY_RESOURCE_COUNT) {
      throw new AppError(400, `Only ${env.LAUNDRY_RESOURCE_COUNT} laundry resources are configured`, "INVALID_RESOURCE");
    }

    const startsAt = parseBookingStart(input.startsAt);
    const endsAt = addMinutes(startsAt, SLOT_MINUTES);

    try {
      return await prisma.$transaction(
        async (tx) => {
          const booking = await tx.laundryBooking.create({
            data: {
              userId,
              resourceType: input.resourceType,
              resourceNumber: input.resourceNumber,
              startsAt,
              endsAt
            }
          });

          await tx.notification.create({
            data: {
              userId,
              title: "Laundry booking confirmed",
              message: `Your ${input.resourceType.toLowerCase()} slot is confirmed for ${startsAt.toISOString()}.`,
              metadata: {
                bookingType: "laundry",
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
        throw new AppError(409, "This laundry slot has already been booked", "SLOT_UNAVAILABLE");
      }

      throw error;
    }
  },

  async cancel(userId: string, bookingId: string) {
    const booking = await prisma.laundryBooking.findFirst({
      where: { id: bookingId, userId }
    });

    if (!booking) {
      throw new AppError(404, "Laundry booking not found", "BOOKING_NOT_FOUND");
    }

    if (booking.status !== BookingStatus.ACTIVE) {
      throw new AppError(400, "Only active bookings can be cancelled", "BOOKING_NOT_ACTIVE");
    }

    if (booking.startsAt <= new Date()) {
      throw new AppError(400, "Bookings cannot be cancelled after they start", "CANCELLATION_WINDOW_CLOSED");
    }

    const updated = await prisma.laundryBooking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date()
      }
    });

    await prisma.notification.create({
      data: {
        userId,
        title: "Laundry booking cancelled",
        message: `Your laundry booking for ${booking.startsAt.toISOString()} has been cancelled.`,
        metadata: {
          bookingType: "laundry",
          bookingId: booking.id
        }
      }
    });

    return updated;
  }
};
