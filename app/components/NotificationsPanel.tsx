"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const notifications = [
  {
    id: "n1",
    icon: "person_add",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "New Lead Assigned",
    desc: "Sarah Miller submitted an inquiry for Skyline Penthouse.",
    time: "2 min ago",
    unread: true,
    href: "/leads/lead-1",
  },
  {
    id: "n2",
    icon: "account_tree",
    iconColor: "text-tertiary",
    iconBg: "bg-tertiary/10",
    title: "Deal Status Changed",
    desc: "Waterfront Villa moved to Negotiation stage.",
    time: "18 min ago",
    unread: true,
    href: "/deals",
  },
  {
    id: "n3",
    icon: "schedule",
    iconColor: "text-error",
    iconBg: "bg-error/10",
    title: "Follow-up Overdue",
    desc: "Call with Marcus Chen was scheduled for 2:00 PM today.",
    time: "1 hr ago",
    unread: true,
    href: "/leads/follow-ups",
  },
  {
    id: "n4",
    icon: "verified",
    iconColor: "text-tertiary",
    iconBg: "bg-tertiary/10",
    title: "Deal Closed! 🎉",
    desc: "Oakwood Estate — $890K — successfully closed by James Wilson.",
    time: "3 hr ago",
    unread: false,
    href: "/deals",
  },
  {
    id: "n5",
    icon: "mail",
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
    title: "New Message",
    desc: "Eleanor Pemberton sent a message about the penthouse.",
    time: "Yesterday",
    unread: false,
    href: "/messages",
  },
  {
    id: "n6",
    icon: "home_work",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Property Listing Updated",
    desc: "Price drop on Luxury Beachfront Villa — now $4.2M.",
    time: "Yesterday",
    unread: false,
    href: "/properties",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(notifications);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 py-12 z-40 bg-black/10 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full drawer-panel-right bg-surface-container-lowest border-l border-outline-variant/30 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 shrink-0">
          <div>
            <h2 className="text-headline-md font-headline-md font-bold text-on-surface">
              Notifications
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              {unreadCount} unread
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-label-sm text-primary font-semibold hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant ml-2"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/20">
          {items.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              onClick={onClose}
              className={`flex items-start gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors ${
                n.unread ? "bg-primary/[0.03]" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${n.iconColor}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {n.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-body-md font-semibold text-on-surface leading-snug">
                    {n.title}
                  </p>
                  {n.unread && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  {n.desc}
                </p>
                <p className="text-body-sm text-outline mt-1">{n.time}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/30 shrink-0">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface-container-low rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Notification Settings
          </Link>
        </div>
      </div>
    </>
  );
}
