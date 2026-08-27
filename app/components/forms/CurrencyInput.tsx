"use client";

import { useRef } from "react";

/** "1234567.5" -> "$1,234,567.5" */
export function formatCurrency(raw: string): string {
  if (!raw) return "";
  const [int = "", dec] = raw.split(".");
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${intFmt}${dec !== undefined ? `.${dec}` : ""}`;
}

/**
 * Currency input: shows "$" and thousands separators while typing, keeps the
 * caret in place, and reports the bare numeric string (e.g. "1250000.50")
 * through onChange — that numeric value is what gets stored in the database.
 */
export default function CurrencyInput({
  value,
  onChange,
  id,
  name,
  placeholder = "$0",
  required = false,
  readOnly = false,
  className,
  ariaLabel,
}: {
  /** Numeric string, e.g. "1250000.5" (no $ or commas). */
  value: string;
  onChange: (numeric: string) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const caret = el.selectionStart ?? el.value.length;
    // Significant characters (digits + dot) left of the caret — stable across formatting.
    const significantBefore = el.value.slice(0, caret).replace(/[^\d.]/g, "").length;

    let raw = el.value.replace(/[^\d.]/g, "");
    const firstDot = raw.indexOf(".");
    if (firstDot !== -1) {
      raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, "");
      const [int, dec] = raw.split(".");
      raw = `${int}.${(dec ?? "").slice(0, 2)}`;
    }
    raw = raw.replace(/^0+(?=\d)/, "");

    onChange(raw);

    // Restore the caret after React re-renders the formatted value.
    requestAnimationFrame(() => {
      const input = ref.current;
      if (!input) return;
      const formatted = input.value;
      let seen = 0;
      let pos = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (/[\d.]/.test(formatted[i]!)) seen++;
        if (seen >= significantBefore) {
          pos = i + 1;
          break;
        }
      }
      if (significantBefore === 0) pos = formatted ? 1 : 0;
      input.setSelectionRange(pos, pos);
    });
  }

  return (
    <input
      ref={ref}
      id={id}
      name={name}
      type="text"
      inputMode="decimal"
      value={formatCurrency(value)}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      aria-label={ariaLabel}
      className={
        className ??
        "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      }
    />
  );
}
