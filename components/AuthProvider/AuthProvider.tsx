"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    const init = async () => {
      try {
        await checkSession(); // just ensure session exists

        const user = await getMe();
        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    };

    init();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
