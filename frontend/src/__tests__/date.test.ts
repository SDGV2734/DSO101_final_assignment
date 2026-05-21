import { describe, expect, it } from "vitest";
import { formatDateTime, formatShortDate, formatTimeRange, todayIsoDate } from "../utils/date";

describe("date helpers", () => {
  it("returns today's ISO date segment", () => {
    expect(todayIsoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formats a readable time range", () => {
    const result = formatTimeRange("2030-01-01T06:00:00.000Z", "2030-01-01T07:00:00.000Z");

    expect(result).toContain("-");
  });

  it("formats full and short dates", () => {
    expect(formatDateTime("2030-01-01T06:00:00.000Z")).toContain("2030");
    expect(formatShortDate("2030-01-01T06:00:00.000Z")).toMatch(/Jan|1|Tue/);
  });
});
