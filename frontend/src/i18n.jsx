import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// Import translation files
import en from './translations/en.json';
import rw from './translations/rw.json';
import fr from './translations/fr.json';

const resources = {
  rw: { translation: rw },
  en: { translation: en },
  fr: { translation: fr },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "rw",
    lng: "rw", // Set the default language to Kinyarwanda
    detection: {
      order: ["cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["cookie"],
      lookupCookie: "lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;