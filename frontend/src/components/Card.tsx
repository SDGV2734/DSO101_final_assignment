import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const Card = ({ children, className = "", ...props }: CardProps) => (
  <div
    className={`rounded-[2rem] border border-ink/10 bg-chalk/88 p-6 shadow-lifted backdrop-blur ${className}`}
    {...props}
  >
    {children}
  </div>
);
