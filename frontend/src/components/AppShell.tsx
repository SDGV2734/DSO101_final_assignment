import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/laundry", label: "Laundry" },
  { to: "/ground", label: "Ground" },
  { to: "/notifications", label: "Notifications" }
];

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-linen text-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(235,185,79,0.45),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(95,142,163,0.28),transparent_30%),linear-gradient(135deg,rgba(255,250,240,0.9),rgba(244,234,219,0.9))]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] border border-ink/10 bg-chalk/80 p-4 shadow-lifted backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-pine">CST Booking System</p>
              <h1 className="font-display text-3xl leading-tight sm:text-4xl">Campus slots, calmly handled.</h1>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-bold transition ${
                      isActive ? "bg-ink text-chalk" : "bg-white/70 text-ink hover:bg-marigold/70"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black">{user?.name}</p>
                <p className="text-xs text-ink/75">{user?.studentId}</p>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </header>
        <main className="relative flex-1">{children}</main>
      </div>
    </div>
  );
};
