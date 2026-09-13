import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Simulated auth state for this static prototype — there is no backend, so
// "signing in" just flips this flag (persisted to localStorage so it survives
// a refresh). Demo credentials are shown on the Sign in screen; any email
// verifying they match logs you in, but really any submit succeeds.

export const DEMO_EMAIL = "karmadorji@gmail.com";
export const DEMO_PASSWORD = "druk1234";

const STORAGE_KEY = "drukdrive:isLoggedIn";
const ROLE_KEY = "drukdrive:role";

// One account, two hats — like Airbnb's host/guest switch. "customer" books
// rides; "driver" manages their own vehicle(s) and the bookings against it.
export type Role = "customer" | "driver";

type AuthContextValue = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  role: Role;
  switchRole: (r: Role) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [role, setRole] = useState<Role>(() => {
    try {
      return (localStorage.getItem(ROLE_KEY) as Role) || "customer";
    } catch {
      return "customer";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isLoggedIn));
    } catch {
      // ignore (e.g. private browsing storage restrictions)
    }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch {
      // ignore
    }
  }, [role]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      login: () => setIsLoggedIn(true),
      logout: () => setIsLoggedIn(false),
      role,
      switchRole: (r: Role) => setRole(r),
    }),
    [isLoggedIn, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
