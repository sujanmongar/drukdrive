import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

// Simple client-side currency switcher. All prices in mockData.ts are in
// USD; this converts for display only (no backend, fixed approximate rates).

export type CurrencyCode = "BTN" | "USD" | "INR";

export const currencies: { code: CurrencyCode; symbol: string; flag: string; label: string; rateFromUsd: number }[] = [
  { code: "BTN", symbol: "Nu.", flag: "🇧🇹", label: "Bhutanese ngultrum", rateFromUsd: 83 },
  { code: "USD", symbol: "$", flag: "🇺🇸", label: "US dollar", rateFromUsd: 1 },
  { code: "INR", symbol: "₹", flag: "🇮🇳", label: "Indian rupee", rateFromUsd: 83 },
];

const STORAGE_KEY = "drukdrive:currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  symbol: string;
  setCurrency: (c: CurrencyCode) => void;
  format: (amountUsd: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as CurrencyCode) || "USD";
    } catch {
      return "USD";
    }
  });

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => {
    const meta = currencies.find((c) => c.code === currency)!;
    return {
      currency,
      symbol: meta.symbol,
      setCurrency,
      format: (amountUsd: number) => {
        const converted = amountUsd * meta.rateFromUsd;
        const decimals = meta.code === "USD" ? 2 : 0;
        return `${meta.symbol}${converted.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      },
    };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
