import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

const variantClasses = {
  primary: "bg-ink text-chalk shadow-lifted hover:-translate-y-0.5 hover:bg-pine",
  secondary: "bg-marigold text-ink hover:-translate-y-0.5 hover:bg-clay hover:text-chalk",
  ghost: "bg-chalk/70 text-ink ring-1 ring-ink/10 hover:bg-white",
  danger: "bg-clay text-chalk hover:-translate-y-0.5 hover:bg-ink"
};

export const Button = ({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
