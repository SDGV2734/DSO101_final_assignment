import { describe, expect, it, vi } from "vitest";
import { AppError } from "../../src/utils/app-error.js";
import { asyncHandler } from "../../src/utils/async-handler.js";
import { buildHourlySlots, getDateBounds, parseBookingStart } from "../../src/utils/time-slots.js";

describe("time slot utilities", () => {
  it("builds hourly slots and marks taken starts unavailable", () => {
    const takenStarts = new Set(["2030-01-01T08:00:00.000Z"]);
    const slots = buildHourlySlots("2030-01-01", takenStarts);

    expect(slots).toHaveLength(16);
    expect(slots[0]).toMatchObject({
      startsAt: "2030-01-01T06:00:00.000Z",
      endsAt: "2030-01-01T07:00:00.000Z",
      available: true
    });
    expect(slots.find((slot) => slot.startsAt === "2030-01-01T08:00:00.000Z")?.available).toBe(false);
  });

  it("returns UTC day boundaries for availability queries", () => {
    const { start, end } = getDateBounds("2030-06-15");

    expect(start.toISOString()).toBe("2030-06-15T00:00:00.000Z");
    expect(end.toISOString()).toBe("2030-06-16T00:00:00.000Z");
  });

  it("validates booking start times", () => {
    expect(parseBookingStart("2030-01-01T06:00:00.000Z").toISOString()).toBe(
      "2030-01-01T06:00:00.000Z"
    );
    expect(() => parseBookingStart("not-a-date")).toThrow("Invalid startsAt datetime");
    expect(() => parseBookingStart("2030-01-01T06:30:00.000Z")).toThrow("Bookings must start on the hour");
    expect(() => parseBookingStart("2030-01-01T23:00:00.000Z")).toThrow(
      "Bookings are only allowed between 06:00 and 22:00 UTC"
    );
  });

  it("rejects invalid date bounds", () => {
    expect(() => getDateBounds("01-01-2030")).toThrow("date must use YYYY-MM-DD format");
    expect(() => getDateBounds("2030-99-99")).toThrow("Invalid date");
  });
});

describe("shared error utilities", () => {
  it("carries operational error metadata", () => {
    const error = new AppError(409, "Conflict", "CONFLICT", { id: "slot-1" });

    expect(error.statusCode).toBe(409);
    expect(error.code).toBe("CONFLICT");
    expect(error.details).toEqual({ id: "slot-1" });
  });

  it("forwards async handler rejections to next", async () => {
    const next = vi.fn();
    const handler = asyncHandler(async () => {
      throw new Error("boom");
    });

    handler({} as never, {} as never, next);
    await vi.waitFor(() => expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" })));
  });
});
