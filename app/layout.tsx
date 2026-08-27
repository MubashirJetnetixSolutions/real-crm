import "./globals.css";
import AppShell from "./components/AppShell";
import { ToastProvider } from "./components/ToastProvider";
import { UserProfileProvider } from "./components/UserProfileProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import React from "react";

export const metadata = {
  title: "Estate X | Real Estate CRM",
  description: "High-performance enterprise real estate CRM and lead dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem("estatex_theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (_) {}
            `,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-background text-on-surface font-body-md antialiased overflow-x-hidden transition-colors duration-200">
        <ThemeProvider>
          <UserProfileProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </UserProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
