import { describe, expect, it } from "vitest";
import { formatTimeRange } from "../utils/date";

describe("date helpers", () => {
  it("formats a readable time range", () => {
    const result = formatTimeRange("2030-01-01T06:00:00.000Z", "2030-01-01T07:00:00.000Z");

    expect(result).toContain("-");
  });
});
