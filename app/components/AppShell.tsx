"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileTopBar from "./MobileTopBar";
import { SidebarProvider } from "./SidebarContext";
import { useUserProfile } from "./UserProfileProvider";

const PUBLIC_PATHS = ["/login"];

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticated, ready } = useUserProfile();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!ready) return;
    if (!isPublic && !authenticated) {
      router.replace("/login");
    }
    if (isPublic && authenticated && pathname === "/login") {
      router.replace("/");
    }
  }, [authenticated, isPublic, pathname, ready, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isPublic) {
    return <>{children}</>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-[260px] lg:max-w-[calc(100vw-260px)] bg-background relative">
        <MobileTopBar />
        {children}
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellInner>{children}</AppShellInner>
    </SidebarProvider>
  );
}
