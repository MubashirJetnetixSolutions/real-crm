"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationsPanel from "./NotificationsPanel";
import { searchIndex } from "../lib/mockData";
import { useUserProfile } from "./UserProfileProvider";
import { useTheme } from "./ThemeProvider";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const router = useRouter();
  const { avatar } = useUserProfile();
  const { theme, toggleTheme } = useTheme();
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = 3;

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <header className="sticky top-14 lg:top-0 z-40 bg-surface/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 min-h-[4.5rem] py-3 lg:py-0 lg:h-20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 w-full transition-colors border-b border-outline-variant/30">
        <div className="min-w-0">
          {subtitle && (
            <p className="text-body-sm text-on-surface-variant font-medium truncate">
              {subtitle}
            </p>
          )}
          <h1 className="text-headline-lg font-bold text-on-surface truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
          {/* Search */}
          <div
            ref={searchRef}
            className={`relative transition-all duration-300 flex-1 sm:flex-none min-w-0 ${
              searchFocused ? "sm:w-80" : "sm:w-60"
            }`}
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => {
                setSearchFocused(true);
                setShowResults(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchResults[0]) {
                  router.push(searchResults[0].href);
                  setShowResults(false);
                  setSearchQuery("");
                }
                if (e.key === "Escape") setShowResults(false);
              }}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
              placeholder="Search CRM..."
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            {showResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden max-h-72 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-body-sm text-outline">No results found</p>
                ) : (
                  searchResults.map((item) => (
                    <Link
                      key={`${item.type}-${item.label}`}
                      href={item.href}
                      onClick={() => {
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors"
                    >
                      <span className="text-label-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {item.type}
                      </span>
                      <span className="text-body-md text-on-surface">{item.label}</span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant relative cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${
                theme === "dark" ? "text-amber-400 rotate-90" : "text-on-surface-variant"
              }`}
            >
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error rounded-full border-2 border-surface flex items-center justify-center text-[9px] font-bold text-on-error">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
            title="Settings"
          >
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </Link>

          <div className="h-8 w-px bg-outline-variant/50 mx-1" />

          {/* Extra actions slot */}
          {actions}

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden xl:block">
              <p className="text-label-md font-semibold text-on-surface leading-none">
                Jetnetix
              </p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">Senior Agent</p>
            </div>
            <Link href="/settings" className="w-10 h-10 rounded-full border-2 border-primary-fixed overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all block">
              <img alt="Profile" className="w-full h-full object-cover" src={avatar} />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
