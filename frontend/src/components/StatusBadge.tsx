import type { BookingStatus } from "../types";

const classes: Record<BookingStatus, string> = {
  ACTIVE: "bg-pine text-chalk",
  CANCELLED: "bg-clay text-chalk",
  COMPLETED: "bg-ink/15 text-ink"
};

export const StatusBadge = ({ status }: { status: BookingStatus }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-black tracking-wide ${classes[status]}`}>
    {status}
  </span>
);
