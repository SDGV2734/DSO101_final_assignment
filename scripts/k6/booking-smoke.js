import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<750"]
  },
  scenarios: {
    smoke: {
      executor: "constant-vus",
      vus: 5,
      duration: "30s"
    }
  }
};

const apiBaseUrl = __ENV.API_BASE_URL || "http://localhost:4000/api";

export default function () {
  const health = http.get(`${apiBaseUrl}/health`);
  check(health, {
    "health status is 200": (response) => response.status === 200
  });

  const availability = http.get(
    `${apiBaseUrl}/ground/availability?date=2030-01-01`,
    {
      headers: {
        Authorization: `Bearer ${__ENV.K6_AUTH_TOKEN || "replace-with-staging-token"}`
      }
    }
  );

  check(availability, {
    "availability is not a server error": (response) => response.status < 500
  });

  sleep(1);
}
