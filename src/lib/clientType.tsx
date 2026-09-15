import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ClientType } from "./booking";

const STORAGE_KEY = "drukdrive:clientType";

const ClientTypeContext = createContext<{ clientType: ClientType; setClientType: (c: ClientType) => void }>({
  clientType: "tourist",
  setClientType: () => {},
});

// Whether the customer lives in Bhutan or is visiting. Chosen once and
// remembered; it decides currency, which booking types show, which add-ons
// and form fields apply, and the payment rule.
export function ClientTypeProvider({ children }: { children: ReactNode }) {
  const [clientType, setClientType] = useState<ClientType>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "local" ? "local" : "tourist";
    } catch {
      return "tourist";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, clientType);
    } catch {
      /* private mode */
    }
  }, [clientType]);
  return <ClientTypeContext.Provider value={{ clientType, setClientType }}>{children}</ClientTypeContext.Provider>;
}

export function useClientType() {
  return useContext(ClientTypeContext);
}
