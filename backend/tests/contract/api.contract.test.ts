import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";

describe("API contract", () => {
  it("exposes a stable health check payload", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toEqual({
      status: "ok",
      service: "cst-booking-system-api"
    });
  });

  it("returns validation errors using the standard error envelope", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "A",
        email: "not-an-email",
        studentId: "1",
        password: "short"
      })
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Request validation failed"
    });
  });
});
