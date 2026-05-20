import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";
import type { GroundBooking, LaundryBooking } from "../types";
import { formatDateTime } from "../utils/date";

type BookingCardProps = {
  type: "laundry" | "ground";
  booking: LaundryBooking | GroundBooking;
  onCancel?: (id: string) => void;
  cancelling?: boolean;
};

const isLaundryBooking = (booking: LaundryBooking | GroundBooking): booking is LaundryBooking =>
  "resourceType" in booking;

export const BookingCard = ({ type, booking, onCancel, cancelling }: BookingCardProps) => (
  <article className="rounded-3xl border border-ink/10 bg-white/70 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-moss">
          {type === "laundry" ? "Laundry slot" : "Football ground"}
        </p>
        <h3 className="mt-2 font-display text-2xl">
          {isLaundryBooking(booking)
            ? `${booking.resourceType.toLowerCase()} ${booking.resourceNumber}`
            : booking.groundName}
        </h3>
      </div>
      <StatusBadge status={booking.status} />
    </div>
    <p className="mt-4 text-sm font-bold text-ink/70">{formatDateTime(booking.startsAt)}</p>
    {booking.status === "ACTIVE" && onCancel ? (
      <Button
        className="mt-5 w-full"
        disabled={cancelling}
        variant="danger"
        onClick={() => onCancel(booking.id)}
      >
        {cancelling ? "Cancelling..." : "Cancel booking"}
      </Button>
    ) : null}
  </article>
);
