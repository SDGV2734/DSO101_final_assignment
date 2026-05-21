import { useEffect, useState } from "react";
import { ApiError, api } from "../api/client";
import { AppShell } from "../components/AppShell";
import { BookingCard } from "../components/BookingCard";
import { Card } from "../components/Card";
import { useAuth } from "../context/AuthContext";
import type { Dashboard } from "../types";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .dashboard()
      .then(({ dashboard }) => setDashboard(dashboard))
      .catch((caughtError) =>
        setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load dashboard.")
      );
  }, []);

  const upcomingCount =
    (dashboard?.upcoming.laundry.length ?? 0) + (dashboard?.upcoming.ground.length ?? 0);

  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-ink text-chalk">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-marigold">Student dashboard</p>
          <h2 className="mt-4 font-display text-5xl">Hello, {user?.name.split(" ")[0] ?? "student"}.</h2>
          <p className="mt-5 text-chalk/85">
            You have <span className="font-black text-marigold">{upcomingCount}</span> upcoming campus
            reservation{upcomingCount === 1 ? "" : "s"}.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-chalk/10 p-5">
              <p className="font-display text-4xl">{dashboard?.upcoming.laundry.length ?? 0}</p>
              <p className="text-sm text-chalk/85">Laundry</p>
            </div>
            <div className="rounded-3xl bg-chalk/10 p-5">
              <p className="font-display text-4xl">{dashboard?.upcoming.ground.length ?? 0}</p>
              <p className="text-sm text-chalk/85">Ground</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-pine">Fresh notices</p>
              <h2 className="font-display text-3xl">Notifications</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {dashboard?.notifications.length ? (
              dashboard.notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="rounded-3xl bg-white/70 p-4">
                  <p className="font-black">{notification.title}</p>
                  <p className="mt-1 text-sm text-ink/80">{notification.message}</p>
                </div>
              ))
            ) : (
              <p className="rounded-3xl bg-white/60 p-6 text-sm text-ink/75">
                Notifications will appear here after your first booking.
              </p>
            )}
          </div>
        </Card>
      </section>

      {error ? <p className="mt-6 rounded-3xl bg-clay/15 p-4 font-bold text-clay">{error}</p> : null}

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-display text-3xl">Upcoming laundry</h2>
          <div className="mt-5 grid gap-4">
            {dashboard?.upcoming.laundry.length ? (
              dashboard.upcoming.laundry.map((booking) => (
                <BookingCard key={booking.id} booking={booking} type="laundry" />
              ))
            ) : (
              <p className="rounded-3xl bg-white/60 p-6 text-sm text-ink/75">No upcoming laundry bookings.</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-3xl">Upcoming ground</h2>
          <div className="mt-5 grid gap-4">
            {dashboard?.upcoming.ground.length ? (
              dashboard.upcoming.ground.map((booking) => (
                <BookingCard key={booking.id} booking={booking} type="ground" />
              ))
            ) : (
              <p className="rounded-3xl bg-white/60 p-6 text-sm text-ink/75">No upcoming ground bookings.</p>
            )}
          </div>
        </Card>
      </section>
    </AppShell>
  );
};
