import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

const base =
  "inline-flex min-h-7 items-center justify-center rounded-md border px-3 py-0.5 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 focus:outline-none";

const variants: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-slate-900 text-white hover:bg-slate-800",
  secondary: "border-transparent bg-white text-slate-900 hover:bg-slate-50",
  danger: "border-transparent bg-red-600 text-white hover:bg-red-700",
  ghost: "border-transparent bg-transparent text-slate-700 hover:bg-slate-100",
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [base, variants[variant], className]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
