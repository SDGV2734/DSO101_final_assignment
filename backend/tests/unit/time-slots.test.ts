import { describe, expect, it } from "vitest";
import { buildHourlySlots, getDateBounds } from "../../src/utils/time-slots.js";

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
});
