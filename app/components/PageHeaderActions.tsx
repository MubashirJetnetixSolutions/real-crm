"use client";

import { useState } from "react";
import Link from "next/link";
import NotificationsPanel from "./NotificationsPanel";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Bell, Settings } from "lucide-react";

interface PageHeaderActionsProps {
  showSettings?: boolean;
  className?: string;
}

export default function PageHeaderActions({
  showSettings = true,
  className = "",
}: PageHeaderActionsProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const unreadCount = 3;

  return (
    <>
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Dark / Light Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant relative cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-[20px] h-[20px] text-amber-400 rotate-0 transition-transform duration-300" />
          ) : (
            <Moon className="w-[20px] h-[20px] text-on-surface-variant transition-transform duration-300" />
          )}
        </button>

        <button
          onClick={() => setNotificationsOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative"
          aria-label="Notifications"
        >
          <Bell className="w-[22px] h-[22px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error rounded-full border-2 border-surface flex items-center justify-center text-[9px] font-bold text-on-error">
              {unreadCount}
            </span>
          )}
        </button>
        {showSettings && (
          <Link
            href="/settings"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-[22px] h-[22px]" />
          </Link>
        )}
      </div>
    </>
  );
}
