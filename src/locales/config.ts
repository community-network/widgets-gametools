import i18n from 'i18next';
import translationEN from './languages/en-US.json';
import translationRU from './languages/ru-RU.json';
import translationCH from './languages/zh-CN.json';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  "en-US": {
    translation: translationEN,
  },
  "ru-RU": {
    translation: translationRU,
  },
  "zh-CN": {
    translation: translationCH,
  }
} as const;

i18n.use(initReactI18next).use(LanguageDetector).init({
  resources,
  fallbackLng: "en-US"
});

export const apiLanguage = {
  "zh-cn": "zh-tw",
}

export const getLanguage = () => {
  let language = window.localStorage.i18nextLng.toLowerCase()
  if (language in apiLanguage) {
      language = apiLanguage[language]
  }
  return language
}