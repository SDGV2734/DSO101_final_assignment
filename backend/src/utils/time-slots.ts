import { AppError } from "./app-error.js";

const SLOT_MINUTES = 60;
const OPEN_HOUR_UTC = 6;
const CLOSE_HOUR_UTC = 22;

export type SlotView = {
  startsAt: string;
  endsAt: string;
  available: boolean;
};

export const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60 * 1000);

export const parseBookingStart = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, "Invalid startsAt datetime", "INVALID_START_TIME");
  }

  if (date <= new Date()) {
    throw new AppError(400, "Bookings must be created for a future slot", "PAST_SLOT");
  }

  if (date.getUTCMinutes() !== 0 || date.getUTCSeconds() !== 0 || date.getUTCMilliseconds() !== 0) {
    throw new AppError(400, "Bookings must start on the hour", "INVALID_SLOT_ALIGNMENT");
  }

  if (date.getUTCHours() < OPEN_HOUR_UTC || date.getUTCHours() >= CLOSE_HOUR_UTC) {
    throw new AppError(400, "Bookings are only allowed between 06:00 and 22:00 UTC", "OUTSIDE_BOOKING_HOURS");
  }

  return date;
};

export const getDateBounds = (dateValue: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    throw new AppError(400, "date must use YYYY-MM-DD format", "INVALID_DATE");
  }

  const start = new Date(`${dateValue}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) {
    throw new AppError(400, "Invalid date", "INVALID_DATE");
  }

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
};

export const buildHourlySlots = (dateValue: string, takenStarts: Set<string>): SlotView[] => {
  const { start } = getDateBounds(dateValue);
  const slots: SlotView[] = [];

  for (let hour = OPEN_HOUR_UTC; hour < CLOSE_HOUR_UTC; hour += 1) {
    const startsAt = new Date(start);
    startsAt.setUTCHours(hour, 0, 0, 0);
    const endsAt = addMinutes(startsAt, SLOT_MINUTES);

    slots.push({
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      available: !takenStarts.has(startsAt.toISOString())
    });
  }

  return slots;
};
