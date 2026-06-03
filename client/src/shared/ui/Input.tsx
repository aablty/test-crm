import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const base =
  "w-full min-h-9 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300";

export default function Input({ className, ...props }: InputProps) {
  const classes = [base, className].filter(Boolean).join(" ");
  return <input className={classes} {...props} />;
}
