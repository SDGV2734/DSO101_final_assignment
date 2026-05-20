import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const server = setupServer(
  http.get("http://localhost:4000/api/laundry/availability", () =>
    HttpResponse.json({
      slots: [
        {
          startsAt: "2030-01-01T06:00:00.000Z",
          endsAt: "2030-01-01T07:00:00.000Z",
          available: true
        }
      ]
    })
  )
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
