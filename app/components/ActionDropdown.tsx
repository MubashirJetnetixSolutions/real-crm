"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export interface ActionDropdownItem {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

interface ActionDropdownProps {
  items: ActionDropdownItem[];
  align?: "left" | "right";
  buttonClassName?: string;
  ariaLabel?: string;
  icon?: string;
}

export default function ActionDropdown({
  items,
  align = "right",
  buttonClassName = "p-2 hover:bg-surface-container-high rounded-lg text-outline-variant transition-colors",
  ariaLabel = "Actions",
  icon = "more_vert",
}: ActionDropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuWidth = 176;
    const menuHeight = items.length * 40 + 16;
    const gap = 4;

    let top = rect.bottom + gap;
    let left = align === "right" ? rect.right - menuWidth : rect.left;

    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - gap;
    }
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }

    setPosition({ top, left });
  }, [align, items.length]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    function onScroll() {
      updatePosition();
    }
    function onClickOutside(e: MouseEvent) {
      if (
        menuRef.current?.contains(e.target as Node) ||
        buttonRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    }
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, updatePosition]);

  const close = () => setOpen(false);

  const menu = open ? (
    <div
      ref={menuRef}
      className="fixed z-[9999] w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_8px_32px_rgba(0,0,0,0.16)] overflow-hidden py-1"
      style={{ top: position.top, left: position.left }}
    >
      {items.map((item) => {
        const className = `w-full flex items-center gap-2 px-4 py-2.5 text-body-sm transition-colors text-left ${
          item.danger
            ? "text-error hover:bg-error/5"
            : "text-on-surface hover:bg-surface-container-low"
        }`;
        const content = (
          <>
            {item.icon && (
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            )}
            {item.label}
          </>
        );
        if (item.href) {
          return (
            <Link key={item.label} href={item.href} className={className} onClick={close}>
              {content}
            </Link>
          );
        }
        return (
          <button
            key={item.label}
            type="button"
            className={className}
            onClick={() => {
              item.onClick?.();
              close();
            }}
          >
            {content}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={buttonClassName}
        aria-label={ariaLabel}
        aria-expanded={open}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </button>
      {typeof document !== "undefined" && menu && createPortal(menu, document.body)}
    </>
  );
}
