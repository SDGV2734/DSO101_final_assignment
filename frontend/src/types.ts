export type UserRole = "STUDENT" | "ADMIN";
export type BookingStatus = "ACTIVE" | "CANCELLED" | "COMPLETED";
export type LaundryResourceType = "WASHER" | "DRYER";

export type User = {
  id: string;
  name: string;
  email: string;
  studentId: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type Slot = {
  startsAt: string;
  endsAt: string;
  available: boolean;
};

export type LaundryBooking = {
  id: string;
  userId: string;
  resourceType: LaundryResourceType;
  resourceNumber: number;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GroundBooking = {
  id: string;
  userId: string;
  groundName: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type Dashboard = {
  upcoming: {
    laundry: LaundryBooking[];
    ground: GroundBooking[];
  };
  past: {
    laundry: LaundryBooking[];
    ground: GroundBooking[];
  };
  notifications: Notification[];
};

export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};
