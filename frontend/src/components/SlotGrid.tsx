import { Button } from "./Button";
import type { Slot } from "../types";
import { formatTimeRange } from "../utils/date";

type SlotGridProps = {
  slots: Slot[];
  loading?: boolean;
  bookingStart?: string | null;
  onBook: (slot: Slot) => void;
};

export const SlotGrid = ({ slots, loading, bookingStart, onBook }: SlotGridProps) => {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-3xl bg-white/60" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink/20 bg-white/60 p-8 text-center">
        <p className="font-display text-2xl">No slots loaded yet.</p>
        <p className="mt-2 text-sm text-ink/60">Choose a date to check availability.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {slots.map((slot) => (
        <article
          key={slot.startsAt}
          className={`rounded-3xl border p-4 transition ${
            slot.available
              ? "border-pine/15 bg-white/80 hover:-translate-y-1 hover:shadow-lifted"
              : "border-ink/5 bg-ink/10 opacity-60"
          }`}
        >
          <p className="font-display text-xl">{formatTimeRange(slot.startsAt, slot.endsAt)}</p>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.25em] text-moss">
            {slot.available ? "Available" : "Booked"}
          </p>
          <Button
            className="mt-4 w-full"
            disabled={!slot.available || bookingStart === slot.startsAt}
            variant={slot.available ? "secondary" : "ghost"}
            onClick={() => onBook(slot)}
          >
            {bookingStart === slot.startsAt ? "Booking..." : slot.available ? "Reserve" : "Taken"}
          </Button>
        </article>
      ))}
    </div>
  );
};
