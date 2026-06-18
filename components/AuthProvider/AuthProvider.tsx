"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const pathname = usePathname();

  // prevents double execution (React Strict Mode + route changes)
  const hasInitialized = useRef(false);
  const isSyncing = useRef(false);

  const syncAuth = useCallback(async () => {
    // prevents cascading / parallel requests
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

  // INITIAL LOAD (Strict Mode safe)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    syncAuth();
  }, [syncAuth]);

  // ROUTE CHANGE SYNC (SAFE, but NOT spammy)
  useEffect(() => {
    // only run after initial load
    if (!hasInitialized.current) return;

    syncAuth();
  }, [pathname, syncAuth]);

  return <>{children}</>;
}
