"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  variant: ToastVariant;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { icon: string; iconClass: string }> = {
  success: { icon: "check_circle", iconClass: "text-tertiary" },
  error: { icon: "error", iconClass: "text-error" },
  info: { icon: "info", iconClass: "text-primary" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, variant, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const success = useCallback((message: string) => toast(message, "success"), [toast]);
  const error = useCallback((message: string) => toast(message, "error"), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-[calc(100vw-3rem)]" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg px-4 py-3 min-w-[280px] animate-[fadeIn_0.2s_ease-out]"
            role="status"
          >
            <span
              className={`material-symbols-outlined text-[22px] shrink-0 ${VARIANT_STYLES[t.variant].iconClass}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {VARIANT_STYLES[t.variant].icon}
            </span>
            <p className="text-body-md text-on-surface flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
