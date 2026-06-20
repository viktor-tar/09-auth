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
        const isValid = await checkSession();

        if (!isValid) {
          clearIsAuthenticated();
          return;
        }

        const user = await getMe();
        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    };

    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
