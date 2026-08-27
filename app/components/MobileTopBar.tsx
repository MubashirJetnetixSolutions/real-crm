"use client";

import Link from "next/link";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeProvider";
import { Menu, Building2, Sun, Moon } from "lucide-react";

export default function MobileTopBar() {
  const { toggleMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between gap-3 h-14 px-4 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 shrink-0">
      <button
        type="button"
        onClick={toggleMobile}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-[24px] h-[24px]" />
      </button>
      <Link href="/" className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
          <Building2 className="w-[18px] h-[18px] text-on-primary" />
        </div>
        <span className="text-label-md font-bold text-on-surface truncate">Estate X</span>
      </Link>
      {/* Theme toggle on mobile */}
      <button
        type="button"
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all text-on-surface-variant cursor-pointer"
        aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? (
          <Sun className="w-[20px] h-[20px] text-amber-400" />
        ) : (
          <Moon className="w-[20px] h-[20px] text-on-surface-variant" />
        )}
      </button>
    </header>
  );
}
