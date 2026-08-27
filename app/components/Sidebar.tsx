"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUserProfile } from "./UserProfileProvider";
import { useSidebar } from "./SidebarContext";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: "dashboard" },
  { name: "Leads", href: "/leads", icon: "group" },
  { name: "Clients", href: "/clients", icon: "person" },
  { name: "Deals Pipelines", href: "/deals", icon: "account_tree" },
  { name: "Properties", href: "/properties", icon: "real_estate_agent" },
  { name: "Calendar", href: "/calendar", icon: "calendar_today" },
  { name: "Team", href: "/team", icon: "groups" },
  { name: "Messages", href: "/messages", icon: "mail", badge: 3 },
  { name: "Report", href: "/report", icon: "assessment" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

const profileMenuItems = [
  { label: "My Profile", icon: "account_circle", href: "/settings" },
  { label: "Account Settings", icon: "tune", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { avatar, logout } = useUserProfile();
  const { mobileOpen, closeMobile } = useSidebar();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeProfile = useCallback(() => {
    setProfileOpen(false);
    setShowLogoutConfirm(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        closeProfile();
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen, closeProfile]);

  async function handleLogout() {
    closeProfile();
    await logout();
    router.push("/login");
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] lg:hidden"
          onClick={closeMobile}
        />
      )}
      <aside
        className={`fixed z-[60] flex flex-col bg-gradient-to-b from-[#0f1729] via-[#141d32] to-[#0c1222] border-r border-white/[0.06] shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out
          inset-y-0 left-0 w-[min(280px,88vw)] h-full
          lg:m-2 lg:h-[calc(100%-1rem)] lg:w-[260px] lg:rounded-xl
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
      {/* Brand */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2 lg:px-5 lg:pt-7 lg:pb-0">
      <Link
        href="/"
        onClick={closeMobile}
        className="group flex-1 block transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/30 shrink-0 transition-all duration-300 group-hover:shadow-primary/50 group-hover:scale-105">
            <span
              className="material-symbols-outlined text-on-primary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              apartment
            </span>
          </div>
          <div>
            <span className="text-headline-md font-bold text-white tracking-tight block leading-tight group-hover:text-primary-fixed transition-colors">
              Estate X
            </span>
            <p className="text-[11px] text-white/45 font-medium tracking-wide uppercase group-hover:text-white/60 transition-colors">
              Premium Real Estate
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={closeMobile}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        aria-label="Close menu"
      >
        <span className="material-symbols-outlined text-[22px]">close</span>
      </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar">
        <p className="px-3 pt-8 pb-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
          Main Menu
        </p>
        {mainNavItems.map((item) => {
          const active = isLinkActive(item.href);
          const hovered = hoveredNav === item.name;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobile}
              onMouseEnter={() => setHoveredNav(item.name)}
              onMouseLeave={() => setHoveredNav(null)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                active
                  ? "bg-primary/20 text-white shadow-[inset_0_0_0_1px_rgba(180,197,255,0.15)]"
                  : "text-white/55 hover:text-white hover:bg-white/[0.08] hover:translate-x-0.5"
              }`}
            >
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_8px_rgba(0,74,198,0.6)]"
                  aria-hidden="true"
                />
              )}
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                  active
                    ? "bg-primary text-on-primary shadow-md shadow-primary/40 scale-105"
                    : hovered
                    ? "bg-white/12 text-white scale-105 shadow-sm"
                    : "bg-white/[0.06] text-white/70 group-hover:bg-white/10 group-hover:text-white"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110"
                  style={
                    active
                      ? { fontVariationSettings: "'FILL' 1, 'wght' 500" }
                      : { fontVariationSettings: "'wght' 400" }
                  }
                >
                  {item.icon}
                </span>
              </span>
              <span className={`text-label-md font-medium flex-1 ${active ? "font-semibold" : ""}`}>
                {item.name}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200 ${
                    active
                      ? "bg-primary text-on-primary"
                      : "bg-error/90 text-white group-hover:scale-110"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: profile menu + logout */}
      <div className="p-4 mt-auto space-y-2" ref={profileRef}>
        {profileOpen && (
          <div className="rounded-xl border border-white/[0.1] bg-[#1a2236]/95 backdrop-blur-md shadow-[0_-8px_32px_rgba(0,0,0,0.3)] overflow-hidden animate-fade-in">
            {profileMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeProfile}
                className="flex items-center gap-3 px-4 py-3 text-white/75 hover:text-white hover:bg-white/[0.08] transition-all duration-150 text-label-md group"
              >
                <span className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </span>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/[0.08] my-1" />
            {showLogoutConfirm ? (
              <div className="px-4 py-3 space-y-3">
                <p className="text-body-sm text-white/70">Sign out of your account?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2 rounded-lg text-label-sm font-medium text-white/70 hover:bg-white/[0.08] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 py-2 rounded-lg text-label-sm font-semibold bg-error/90 text-white hover:bg-error transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 transition-all duration-150 text-label-md group"
              >
                <span className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center group-hover:bg-error/20 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </span>
                Log Out
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setShowLogoutConfirm(false);
            setProfileOpen((v) => !v);
          }}
          aria-expanded={profileOpen}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
            profileOpen
              ? "bg-white/[0.1] border-primary/30 shadow-[0_0_0_1px_rgba(0,74,198,0.2)]"
              : "bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.09] hover:border-white/[0.14] hover:shadow-lg hover:shadow-black/20"
          }`}
        >
          <div className="relative shrink-0">
            <img
              alt="CRM Admin"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40 transition-all duration-200 group-hover:ring-primary/60"
              src={avatar}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary rounded-full border-2 border-[#141d32] animate-pulse" />
          </div>
          <div className="overflow-hidden min-w-0 text-left flex-1">
            <p className="text-white font-semibold text-label-md truncate">Jetnetix Admin</p>
            <p className="text-white/45 text-body-sm truncate">Executive Manager</p>
          </div>
          <span
            className={`material-symbols-outlined text-white/40 text-[20px] shrink-0 transition-transform duration-300 ${
              profileOpen ? "rotate-180 text-primary-fixed" : ""
            }`}
          >
            expand_less
          </span>
        </button>

        {!profileOpen && (
          <button
            type="button"
            onClick={() => {
              setProfileOpen(true);
              setShowLogoutConfirm(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/55 hover:text-error hover:border-error/30 hover:bg-error/10 transition-all duration-200 text-label-sm font-medium active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log Out
          </button>
        )}
      </div>
    </aside>
    </>
  );
}
