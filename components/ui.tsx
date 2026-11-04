import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "ink" | "signal" | "card";

const variants: Record<Variant, string> = {
  ink: "bg-ink text-white",
  signal: "bg-signal text-ink",
  card: "bg-card text-ink",
};

export function Button({
  variant = "ink",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...rest}
      className={`brutal-press inline-flex min-h-14 items-center justify-center gap-3 px-6 font-mono text-[0.95rem] font-bold uppercase tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center border-2 border-ink bg-signal px-2 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink ${className}`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label-mono text-muted ${className}`}>{children}</p>;
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`size-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
