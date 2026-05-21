import { useEffect, useState } from "react";
import { ApiError, api } from "../api/client";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import type { Notification } from "../types";
import { formatDateTime } from "../utils/date";

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      const response = await api.notifications();
      setNotifications(response.notifications);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load notifications.");
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    await loadNotifications();
  };

  return (
    <AppShell>
      <Card>
        <p className="text-xs font-black uppercase tracking-[0.35em] text-pine">In-app notifications</p>
        <h2 className="mt-3 font-display text-5xl">Your booking trail.</h2>
        <p className="mt-4 max-w-2xl text-ink/80">
          Confirmations and cancellation notes are stored here. This keeps the demo self-contained while
          leaving a clear path to add email reminders later.
        </p>
      </Card>

      {error ? <p className="mt-6 rounded-3xl bg-clay/15 p-4 font-bold text-clay">{error}</p> : null}

      <section className="mt-8 grid gap-4">
        {notifications.length ? (
          notifications.map((notification) => (
            <Card key={notification.id} className={notification.readAt ? "opacity-70" : ""}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-pine">
                    {notification.readAt ? "Read" : "New"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl">{notification.title}</h3>
                  <p className="mt-2 text-ink/80">{notification.message}</p>
                  <p className="mt-4 text-xs font-bold text-ink/75">{formatDateTime(notification.createdAt)}</p>
                </div>
                {!notification.readAt ? (
                  <Button variant="ghost" onClick={() => markAsRead(notification.id)}>
                    Mark as read
                  </Button>
                ) : null}
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <p className="font-display text-3xl">No notifications yet.</p>
            <p className="mt-2 text-ink/75">Book a slot and the first one will appear here.</p>
          </Card>
        )}
      </section>
    </AppShell>
  );
};
