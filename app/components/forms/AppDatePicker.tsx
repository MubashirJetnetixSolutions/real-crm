"use client";

import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/** Parse "YYYY-MM-DD" (or full datetime) as a local date without timezone shifts. */
function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toIso(date: Date | null): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const InputShell = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function InputShell(props, ref) {
    return <input {...props} ref={ref} readOnly={props.readOnly} />;
  }
);

/**
 * react-datepicker styled like the app's native inputs.
 * Values in and out are "YYYY-MM-DD" strings (what MySQL DATE columns use).
 */
export default function AppDatePicker({
  id,
  value,
  onChange,
  placeholder = "Select date",
  required = false,
  readOnly = false,
  minDate,
  maxDate,
  className,
}: {
  id?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}) {
  return (
    <DatePicker
      id={id}
      selected={parseDate(value)}
      onChange={(date: Date | null) => onChange(toIso(date))}
      dateFormat="MMM d, yyyy"
      placeholderText={placeholder}
      required={required}
      readOnly={readOnly}
      disabled={readOnly}
      minDate={parseDate(minDate ?? null) ?? undefined}
      maxDate={parseDate(maxDate ?? null) ?? undefined}
      customInput={<InputShell />}
      wrapperClassName="w-full"
      popperClassName="!z-[120]"
      className={
        className ??
        "w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      }
      autoComplete="off"
    />
  );
}
