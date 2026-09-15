import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { currentUser as defaultUser } from "../data/mockData";

// The signed-in user's editable profile — persisted to localStorage so
// edits made in Account / Personal Info survive a refresh and are reflected
// everywhere the profile is shown (header, profile hero, receipts).
export type CurrentUser = typeof defaultUser;

const STORAGE_KEY = "drukdrive:currentUser";

type CurrentUserContextValue = {
  user: CurrentUser;
  updateUser: (patch: Partial<CurrentUser>) => void;
  resetUser: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? { ...defaultUser, ...(JSON.parse(raw) as Partial<CurrentUser>) }
        : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore (e.g. private browsing storage restrictions)
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      updateUser: (patch: Partial<CurrentUser>) =>
        setUser((prev) => ({ ...prev, ...patch })),
      resetUser: () => setUser(defaultUser),
    }),
    [user],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx)
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  return ctx;
}
