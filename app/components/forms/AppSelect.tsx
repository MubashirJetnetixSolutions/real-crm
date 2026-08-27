"use client";

import Select from "react-select";

export interface SelectOption {
  value: string;
  label: string;
}

type Size = "sm" | "md" | "lg";

const CONTROL_SIZES: Record<Size, string> = {
  sm: "px-3 py-1 text-body-sm rounded-md",
  md: "px-3 py-1.5 text-body-md rounded-lg",
  lg: "px-4 py-1.5 text-body-md rounded-lg",
};

/**
 * react-select styled to match the app's native selects exactly.
 * Menus render in a portal so they never clip inside overflow-hidden modals.
 */
export default function AppSelect({
  instanceId,
  value,
  onChange,
  options,
  placeholder,
  isSearchable = false,
  isClearable = false,
  isDisabled = false,
  size = "lg",
  ariaLabel,
}: {
  instanceId: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  size?: Size;
  ariaLabel?: string;
}) {
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <Select<SelectOption>
      inputId={instanceId}
      instanceId={instanceId}
      aria-label={ariaLabel}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : null)}
      options={options as SelectOption[]}
      placeholder={placeholder ?? "Select..."}
      isSearchable={isSearchable}
      isClearable={isClearable}
      isDisabled={isDisabled}
      unstyled
      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
      menuPosition="fixed"
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 110 }) }}
      classNames={{
        container: () => "w-full",
        control: ({ isFocused }) =>
          `w-full bg-surface-container-low border ${CONTROL_SIZES[size]} text-on-surface transition-all cursor-pointer min-h-[42px] ${
            isFocused ? "border-primary ring-2 ring-primary/20" : "border-outline-variant"
          } ${isDisabled ? "opacity-60" : ""}`,
        valueContainer: () => "gap-1",
        singleValue: () => "text-on-surface",
        placeholder: () => "text-outline",
        input: () => "text-on-surface [&>input:focus]:ring-0",
        indicatorsContainer: () => "gap-1 text-outline",
        clearIndicator: () => "p-0.5 rounded hover:bg-surface-container-high hover:text-on-surface cursor-pointer",
        dropdownIndicator: () => "p-0.5",
        menu: () =>
          "mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden",
        menuList: () => "py-1 max-h-60",
        option: ({ isFocused, isSelected }) =>
          `px-3 py-2 text-body-md cursor-pointer ${
            isSelected
              ? "bg-primary/10 text-primary font-semibold"
              : isFocused
                ? "bg-surface-container-high text-on-surface"
                : "text-on-surface"
          }`,
        noOptionsMessage: () => "px-3 py-2 text-body-sm text-outline",
      }}
    />
  );
}
