"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const hasInitialized = useRef(false);
  const isSyncing = useRef(false);

  const syncAuth = useCallback(async () => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      const sessionValid = await checkSession();

      if (!sessionValid) {
        clearIsAuthenticated();
        return;
      }

      const user = await getMe();
      setUser(user);
    } catch {
      clearIsAuthenticated();
    } finally {
      isSyncing.current = false;
    }
  }, [setUser, clearIsAuthenticated]);

  // ONLY INITIAL LOAD (NO ROUTE SYNC YET)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    syncAuth();
  }, [syncAuth]);

  return <>{children}</>;
}
