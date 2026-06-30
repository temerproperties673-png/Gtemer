import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "lang";

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang || "en");

  // Hydrate from localStorage or URL on client
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      const isValid = (l: string | null): l is Lang =>
        l === "en" || l === "am" || l === "om" || l === "ti" || l === "so";

      if (isValid(urlLang)) {
        setLangState(urlLang);
        localStorage.setItem(STORAGE_KEY, urlLang);
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (isValid(saved)) setLangState(saved);
      }
    } catch {
      // ignore localStorage security/access errors on SSR or sandboxed environments
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", l);
        window.history.replaceState({}, "", url.toString());
      }
    } catch {
      // ignore localStorage security/access errors
    }
  };

  const t = (key: TranslationKey) => translations[lang][key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
