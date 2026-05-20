import { useEffect, useState } from "react";
import { ApiError, api } from "../api/client";
import { AppShell } from "../components/AppShell";
import { BookingCard } from "../components/BookingCard";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { SlotGrid } from "../components/SlotGrid";
import type { Dashboard, LaundryBooking, LaundryResourceType, Slot } from "../types";
import { todayIsoDate } from "../utils/date";

export const LaundryPage = () => {
  const [date, setDate] = useState(todayIsoDate());
  const [resourceType, setResourceType] = useState<LaundryResourceType>("WASHER");
  const [resourceNumber, setResourceNumber] = useState(1);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<LaundryBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingStart, setBookingStart] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    const { dashboard } = await api.dashboard();
    const allLaundry = [
      ...dashboard.upcoming.laundry,
      ...dashboard.past.laundry
    ] satisfies Dashboard["upcoming"]["laundry"];
    setBookings(allLaundry);
  };

  const loadAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ slots }] = await Promise.all([
        api.laundryAvailability({ date, resourceType, resourceNumber }),
        loadBookings()
      ]);
      setSlots(slots);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load laundry slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAvailability();
  }, [date, resourceType, resourceNumber]);

  const handleBook = async (slot: Slot) => {
    setBookingStart(slot.startsAt);
    setError(null);
    setMessage(null);
    try {
      await api.createLaundryBooking({
        resourceType,
        resourceNumber,
        startsAt: slot.startsAt
      });
      setMessage("Laundry slot booked successfully.");
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
      await api.cancelLaundryBooking(id);
      setMessage("Laundry booking cancelled.");
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
        <Card>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-moss">Laundry booking</p>
          <h2 className="mt-3 font-display text-5xl">Reserve a machine.</h2>
          <p className="mt-4 text-ink/65">
            Choose a washer or dryer, pick the machine number, and reserve an hourly slot.
          </p>

          <div className="mt-8 grid gap-5">
            <Input label="Date" type="date" value={date} min={todayIsoDate()} onChange={(event) => setDate(event.target.value)} />

            <label className="grid gap-2 text-sm font-bold text-ink">
              <span>Machine type</span>
              <select
                className="rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-base font-bold text-ink outline-none focus:border-pine focus:ring-4 focus:ring-pine/10"
                value={resourceType}
                onChange={(event) => setResourceType(event.target.value as LaundryResourceType)}
              >
                <option value="WASHER">Washer</option>
                <option value="DRYER">Dryer</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink">
              <span>Machine number</span>
              <select
                className="rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-base font-bold text-ink outline-none focus:border-pine focus:ring-4 focus:ring-pine/10"
                value={resourceNumber}
                onChange={(event) => setResourceNumber(Number(event.target.value))}
              >
                {[1, 2, 3, 4].map((number) => (
                  <option key={number} value={number}>
                    Machine {number}
                  </option>
                ))}
              </select>
            </label>

            <Button variant="ghost" onClick={loadAvailability}>
              Refresh availability
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-moss">Available slots</p>
              <h2 className="font-display text-3xl">
                {resourceType.toLowerCase()} {resourceNumber}
              </h2>
            </div>
            <p className="text-sm font-bold text-ink/60">{date}</p>
          </div>

          {message ? <p className="mt-5 rounded-3xl bg-pine/10 p-4 font-bold text-pine">{message}</p> : null}
          {error ? <p className="mt-5 rounded-3xl bg-clay/15 p-4 font-bold text-clay">{error}</p> : null}

          <div className="mt-6">
            <SlotGrid slots={slots} loading={loading} bookingStart={bookingStart} onBook={handleBook} />
          </div>
        </Card>
      </section>

      <Card className="mt-8">
        <h2 className="font-display text-3xl">Your laundry history</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bookings.length ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                cancelling={cancellingId === booking.id}
                onCancel={handleCancel}
                type="laundry"
              />
            ))
          ) : (
            <p className="rounded-3xl bg-white/60 p-6 text-sm text-ink/60">No laundry bookings yet.</p>
          )}
        </div>
      </Card>
    </AppShell>
  );
};
