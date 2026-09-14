import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

// Language preference for the prototype. The choice is stored and reflected in
// the UI, but copy itself is not translated — there is no i18n catalogue behind
// this yet, so treat it as the preference plumbing only.

export type LanguageCode = "en" | "dz" | "hi" | "ne";

export const languages: { code: LanguageCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "dz", label: "Dzongkha", native: "རྫོང་ཁ" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
];

const STORAGE_KEY = "drukdrive:language";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as LanguageCode) || "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (l: LanguageCode) => {
    setLanguageState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
