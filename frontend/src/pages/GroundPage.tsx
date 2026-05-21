import { useEffect, useState } from "react";
import { ApiError, api } from "../api/client";
import { AppShell } from "../components/AppShell";
import { BookingCard } from "../components/BookingCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { SlotGrid } from "../components/SlotGrid";
import type { Dashboard, GroundBooking, Slot } from "../types";
import { todayIsoDate } from "../utils/date";

export const GroundPage = () => {
  const [date, setDate] = useState(todayIsoDate());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<GroundBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingStart, setBookingStart] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    const { dashboard } = await api.dashboard();
    const allGround = [
      ...dashboard.upcoming.ground,
      ...dashboard.past.ground
    ] satisfies Dashboard["upcoming"]["ground"];
    setBookings(allGround);
  };

  const loadAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ slots }] = await Promise.all([api.groundAvailability(date), loadBookings()]);
      setSlots(slots);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load ground slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAvailability();
  }, [date]);

  const handleBook = async (slot: Slot) => {
    setBookingStart(slot.startsAt);
    setError(null);
    setMessage(null);
    try {
      await api.createGroundBooking(slot.startsAt);
      setMessage("Football ground slot booked successfully.");
      await loadAvailability();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to book this slot.");
      await loadAvailability();
    } finally {
      setBookingStart(null);
    }
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    setError(null);
    setMessage(null);
    try {
      await api.cancelGroundBooking(id);
      setMessage("Ground booking cancelled.");
      await loadAvailability();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to cancel this booking.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <Card className="bg-pine text-chalk">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-marigold">Football ground</p>
          <h2 className="mt-3 font-display text-5xl">Claim the pitch.</h2>
          <p className="mt-4 text-chalk/85">
            Reserve the CST football ground for a clean one-hour slot. The backend rejects clashes even
            when two students click at the same time.
          </p>

          <div className="mt-8 grid gap-5">
            <Input
              className="bg-chalk text-ink"
              label="Date"
              min={todayIsoDate()}
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <Button variant="secondary" onClick={loadAvailability}>
              Refresh availability
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-pine">Available slots</p>
              <h2 className="font-display text-3xl">CST Football Ground</h2>
            </div>
            <p className="text-sm font-bold text-ink/75">{date}</p>
          </div>

          {message ? <p className="mt-5 rounded-3xl bg-pine/10 p-4 font-bold text-pine">{message}</p> : null}
          {error ? <p className="mt-5 rounded-3xl bg-clay/15 p-4 font-bold text-clay">{error}</p> : null}

          <div className="mt-6">
            <SlotGrid slots={slots} loading={loading} bookingStart={bookingStart} onBook={handleBook} />
          </div>
        </Card>
      </section>

      <Card className="mt-8">
        <h2 className="font-display text-3xl">Your ground history</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bookings.length ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                cancelling={cancellingId === booking.id}
                onCancel={handleCancel}
                type="ground"
              />
            ))
          ) : (
            <p className="rounded-3xl bg-white/60 p-6 text-sm text-ink/75">No ground bookings yet.</p>
          )}
        </div>
      </Card>
    </AppShell>
  );
};
