import { describe, expect, it } from "vitest";
import { api } from "../client";

describe("frontend API network layer", () => {
  it("maps laundry availability responses from the backend contract", async () => {
    const response = await api.laundryAvailability({
      date: "2030-01-01",
      resourceType: "WASHER",
      resourceNumber: 1
    });

    expect(response.slots).toHaveLength(1);
    expect(response.slots[0]).toMatchObject({
      startsAt: "2030-01-01T06:00:00.000Z",
      available: true
    });
  });
});
