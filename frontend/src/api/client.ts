import type {
  ApiErrorBody,
  Dashboard,
  GroundBooking,
  LaundryBooking,
  LaundryResourceType,
  Notification,
  Slot,
  User
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error?.message ?? "Something went wrong",
      data.error?.code,
      data.error?.details
    );
  }

  return data;
};

export const api = {
  register(input: { name: string; email: string; studentId: string; password: string }) {
    return request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: input
    });
  },

  login(input: { email: string; password: string }) {
    return request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: input
    });
  },

  logout() {
    return request<void>("/auth/logout", { method: "POST" });
  },

  me() {
    return request<{ user: User }>("/auth/me");
  },

  dashboard() {
    return request<{ dashboard: Dashboard }>("/dashboard");
  },

  laundryAvailability(input: {
    date: string;
    resourceType: LaundryResourceType;
    resourceNumber: number;
  }) {
    const params = new URLSearchParams({
      date: input.date,
      resourceType: input.resourceType,
      resourceNumber: String(input.resourceNumber)
    });
    return request<{ slots: Slot[] }>(`/laundry/availability?${params.toString()}`);
  },

  createLaundryBooking(input: {
    resourceType: LaundryResourceType;
    resourceNumber: number;
    startsAt: string;
  }) {
    return request<{ booking: LaundryBooking }>("/laundry/bookings", {
      method: "POST",
      body: input
    });
  },

  cancelLaundryBooking(id: string) {
    return request<{ booking: LaundryBooking }>(`/laundry/bookings/${id}/cancel`, {
      method: "PATCH"
    });
  },

  groundAvailability(date: string) {
    const params = new URLSearchParams({ date });
    return request<{ slots: Slot[] }>(`/ground/availability?${params.toString()}`);
  },

  createGroundBooking(startsAt: string) {
    return request<{ booking: GroundBooking }>("/ground/bookings", {
      method: "POST",
      body: { startsAt }
    });
  },

  cancelGroundBooking(id: string) {
    return request<{ booking: GroundBooking }>(`/ground/bookings/${id}/cancel`, {
      method: "PATCH"
    });
  },

  notifications() {
    return request<{ notifications: Notification[] }>("/notifications");
  },

  markNotificationRead(id: string) {
    return request<void>(`/notifications/${id}/read`, { method: "PATCH" });
  }
};
