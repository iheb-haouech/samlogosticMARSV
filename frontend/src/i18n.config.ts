import { initReactI18next } from "react-i18next";
import fr from "./translations/fr.json";
import en from "./translations/en.json";
import i18next from "i18next";
i18next.use(initReactI18next).init({
  resources: {
    fr: {
      translation: fr,
    },
    en: {
      translation: en,
    },
  },
  lng: localStorage.getItem("i18nextLng") || "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18next;
