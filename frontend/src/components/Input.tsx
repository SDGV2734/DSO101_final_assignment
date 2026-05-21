import { useState, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  labelClassName?: string;
};

export const Input = ({ label, className = "", labelClassName = "text-ink", type, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <label className={`grid gap-2 text-sm font-bold ${labelClassName}`}>
      <span>{label}</span>
      <span className="relative block">
        <input
          className={`w-full rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-base font-medium text-ink outline-none transition placeholder:text-ink/35 focus:border-pine focus:ring-4 focus:ring-pine/10 ${
            isPassword ? "pr-24" : ""
          } ${className}`}
          type={inputType}
          {...props}
        />
        {isPassword ? (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/8 px-4 py-2 text-xs font-black text-ink transition hover:bg-marigold/70"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        ) : null}
      </span>
    </label>
  );
};
