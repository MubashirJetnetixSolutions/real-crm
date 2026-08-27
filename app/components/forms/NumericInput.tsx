"use client";

/**
 * Text input that only accepts numbers.
 * mode="integer"  -> digits only (quantity, sqft, ZIP, age)
 * mode="decimal"  -> digits plus a single decimal point (e.g. 2.5 baths)
 * mode="phone"    -> digits plus phone punctuation (+ ( ) - space); letters blocked
 */
export default function NumericInput({
  value,
  onChange,
  mode = "integer",
  id,
  name,
  placeholder,
  required = false,
  maxLength,
  className,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  mode?: "integer" | "decimal" | "phone";
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  ariaLabel?: string;
}) {
  function sanitize(raw: string): string {
    if (mode === "phone") return raw.replace(/[^\d+\-() ]/g, "");
    if (mode === "decimal") {
      let cleaned = raw.replace(/[^\d.]/g, "");
      const firstDot = cleaned.indexOf(".");
      if (firstDot !== -1) {
        cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
      }
      return cleaned;
    }
    return raw.replace(/\D/g, "");
  }

  return (
    <input
      id={id}
      name={name}
      type="text"
      inputMode={mode === "phone" ? "tel" : mode === "decimal" ? "decimal" : "numeric"}
      value={value}
      onChange={(e) => onChange(sanitize(e.target.value))}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      aria-label={ariaLabel}
      className={
        className ??
        "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      }
    />
  );
}
