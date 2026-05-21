import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ApiError } from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";

type AuthPageProps = {
  mode: "login" | "register";
};

export const AuthPage = ({ mode }: AuthPageProps) => {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login, register, pending } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      if (isRegister) {
        await register({
          name: String(form.get("name") ?? ""),
          studentId: String(form.get("studentId") ?? ""),
          email,
          password
        });
      } else {
        await login({ email, password });
      }

      navigate("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to continue right now.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-linen text-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(235,185,79,0.56),transparent_30%),radial-gradient(circle_at_80%_8%,rgba(95,142,163,0.33),transparent_28%),linear-gradient(140deg,#fffaf0,#f4eadb)]" />
      <section className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.45em] text-pine">CST Booking System</p>
          <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:text-7xl">
            Book laundry and ground slots without the hallway negotiations.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-ink/80">
            A calm campus booking desk for students: authenticated access, live availability, protected
            reservations, and a tidy dashboard for everything you have booked.
          </p>
        </div>

        <Card className="animate-[slideUp_0.5s_ease-out]">
          <h2 className="font-display text-4xl">{isRegister ? "Create account" : "Welcome back"}</h2>
          <p className="mt-2 text-sm text-ink/75">
            {isRegister
              ? "Use your student details to start reserving campus facilities."
              : "Sign in to manage your laundry and football ground bookings."}
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            {isRegister ? (
              <>
                <Input label="Full name" name="name" autoComplete="name" required />
                <Input label="Student ID" name="studentId" autoComplete="username" required />
              </>
            ) : null}
            <Input label="Email" name="email" type="email" autoComplete="email" required />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              required
            />

            {error ? (
              <div className="rounded-2xl bg-clay/15 px-4 py-3 text-sm font-bold text-clay">{error}</div>
            ) : null}

            <Button disabled={pending} type="submit">
              {pending ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/80">
            {isRegister ? "Already registered?" : "New to the system?"}{" "}
            <Link className="font-black text-pine underline decoration-marigold decoration-4" to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </Card>
      </section>
    </main>
  );
};
