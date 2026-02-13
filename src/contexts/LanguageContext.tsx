import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "@/i18n/translations";

const VALID_LANGUAGES: Language[] = ["en", "pt"];

const parseStoredLanguage = (value: string | null): Language => {
  if (value && VALID_LANGUAGES.includes(value as Language)) {
    return value as Language;
  }

  return "en";
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return parseStoredLanguage(localStorage.getItem("language"));
    }
    return "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    localStorage.setItem("language", lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "pt" : "en";
      localStorage.setItem("language", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[key]?.[language] ?? key,
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
