"use client";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="block mb-4">
      <span className="text-sm font-semibold text-light/70 uppercase tracking-wider block mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-dark border border-white/6 rounded-xl px-3 py-2.5 text-white placeholder:text-light/15 focus:border-accent focus:outline-none";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} resize-none ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputClass} ${props.className ?? ""}`} />
  );
}
