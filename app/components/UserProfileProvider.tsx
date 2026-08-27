"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, ApiClientError } from "../lib/apiClient";
import {
  DEFAULT_AVATAR,
  getStoredAvatar,
  setStoredAvatar,
} from "../lib/userProfile";
import type { AuthUser } from "@/types/auth";

interface UserProfileContextValue {
  user: AuthUser | null;
  avatar: string;
  setAvatar: (url: string) => void;
  authenticated: boolean;
  ready: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [avatarOverride, setAvatarOverride] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredAvatar();
    if (stored !== DEFAULT_AVATAR) setAvatarOverride(stored);

    let cancelled = false;
    api
      .get<AuthUser>("/api/auth/me")
      .then(({ data }) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    function syncAvatar() {
      const value = getStoredAvatar();
      setAvatarOverride(value === DEFAULT_AVATAR ? null : value);
    }
    window.addEventListener("drImpact-avatar-change", syncAvatar);
    return () => {
      cancelled = true;
      window.removeEventListener("drImpact-avatar-change", syncAvatar);
    };
  }, []);

  const setAvatar = useCallback((url: string) => {
    setStoredAvatar(url);
    setAvatarOverride(url);
  }, []);

  const login = useCallback(async (email: string, password: string, remember = false) => {
    try {
      const { data } = await api.post<AuthUser>("/api/auth/login", { email, password, remember });
      setUser(data);
    } catch (err) {
      if (err instanceof ApiClientError) throw err;
      throw new ApiClientError(0, "Unable to reach the server. Please try again.");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  const avatar = avatarOverride ?? user?.avatarUrl ?? DEFAULT_AVATAR;

  return (
    <UserProfileContext.Provider
      value={{ user, avatar, setAvatar, authenticated: user !== null, ready, login, logout }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return ctx;
}
