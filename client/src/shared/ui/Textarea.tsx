import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const base =
  "w-full min-h-24 resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300";

export default function Textarea({ className, ...props }: TextareaProps) {
  const classes = [base, className].filter(Boolean).join(" ");
  return <textarea className={classes} {...props} />;
}
