import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth";

const STORAGE_KEY = "drukdrive:wishlist";

type WishlistContextValue = {
  /** Guests and customers can save; drivers have no use for it. */
  enabled: boolean;
  ids: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids]);

  const { isLoggedIn, role } = useAuth();
  // Guests save on this device; the same list is there after they sign in.
  const enabled = !(isLoggedIn && role === "driver");

  const value = useMemo(
    () => ({
      enabled,
      ids,
      isSaved: (id: string) => ids.includes(id),
      toggle: (id: string) =>
        setIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        ),
    }),
    [enabled, ids],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
