import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setDictionary, type Dictionary } from "./i18n";

// The site language. Choosing one loads that language's dictionary (each is
// its own small chunk), then re-renders the whole app in it.

export type LanguageCode = "en" | "dz" | "hi" | "ne";

export const languages: {
  code: LanguageCode;
  label: string;
  native: string;
  flag: string;
}[] = [
  {
    code: "en",
    label: "English",
    native: "English",
    flag: "🇬🇧",
  },
  {
    code: "dz",
    label: "Dzongkha",
    native: "རྫོང་ཁ",
    flag: "🇧🇹",
  },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  {
    code: "ne",
    label: "Nepali",
    native: "नेपाली",
    flag: "🇳🇵",
  },
];

const STORAGE_KEY = "drukdrive:language";

const loaders: Record<
  Exclude<LanguageCode, "en">,
  () => Promise<Dictionary>
> = {
  dz: () => import("../i18n/dz.json").then((m) => m.default as Dictionary),
  hi: () => import("../i18n/hi.json").then((m) => m.default as Dictionary),
  ne: () => import("../i18n/ne.json").then((m) => m.default as Dictionary),
};

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function stored(): LanguageCode {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    return v && languages.some((l) => l.code === v) ? v : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [wanted, setWanted] = useState<LanguageCode>(stored);
  // The language whose dictionary is loaded and applied.
  const [active, setActive] = useState<LanguageCode | null>(
    wanted === "en" ? "en" : null,
  );

  useEffect(() => {
    let cancelled = false;
    const load = wanted === "en" ? Promise.resolve({}) : loaders[wanted]();
    load
      .catch(() => ({}))
      .then((d) => {
        if (cancelled) return;
        setDictionary(d);
        document.documentElement.lang = wanted;
        setActive(wanted);
      });
    return () => {
      cancelled = true;
    };
  }, [wanted]);

  const value = useMemo(
    () => ({
      language: active ?? wanted,
      setLanguage: (l: LanguageCode) => {
        setWanted(l);
        try {
          localStorage.setItem(STORAGE_KEY, l);
        } catch {
          // ignore
        }
      },
    }),
    [active, wanted],
  );

  // Nothing renders until the stored language's dictionary is in, so a
  // returning Dzongkha reader never sees an English flash. The key remounts
  // the app on a switch, so every t() call runs again in the new language.
  if (!active) return null;
  return (
    <LanguageContext.Provider value={value}>
      <Fragment key={active}>{children}</Fragment>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
