import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Simulated auth state for this static prototype — there is no backend, so
// "signing in" just flips this flag (persisted to localStorage so it survives
// a refresh). Demo credentials are shown on the Sign in screen; any email
// verifying they match logs you in, but really any submit succeeds.

export const DEMO_EMAIL = "karmadorji@gmail.com";
export const DEMO_PASSWORD = "druk1234";

const STORAGE_KEY = "drukdrive:isLoggedIn";

type AuthContextValue = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isLoggedIn));
    } catch {
      // ignore (e.g. private browsing storage restrictions)
    }
  }, [isLoggedIn]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      login: () => setIsLoggedIn(true),
      logout: () => setIsLoggedIn(false),
    }),
    [isLoggedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
