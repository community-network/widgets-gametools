import i18n from "i18next";
import translationEN from "./languages/en-US.json";
import translationTR from "./languages/tr-TR.json";
import translationCH from "./languages/zh-CN.json";
import translationNL from "./languages/nl-NL.json";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  "en-US": {
    translation: translationEN,
  },
  "tr-TR": {
    translation: translationTR,
  },
  // "ru-RU": {
  //   translation: translationRU,
  // },
  "zh-CN": {
    translation: translationCH,
  },
  "nl-NL": {
    translation: translationNL,
  },
} as const;

i18n.use(initReactI18next).use(LanguageDetector).init({
  resources,
  fallbackLng: "en-US",
});

export const apiLanguage = {
  "zh-cn": "zh-tw",
};

export const getLanguage = (): string => {
  let language = window.localStorage.i18nextLng.toLowerCase();
  if (language in apiLanguage) {
    language = apiLanguage[language];
  }
  return language;
};
