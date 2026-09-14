import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

export const supportedLanguages = ["en-US", "nl-NL", "tr-TR", "zh-CN"];
export const defaultLanguage = "en-US";

const languageDetector = new LanguageDetector(null, {
  convertDetectedLanguage: (lng) => {
    if (supportedLanguages.includes(lng)) {
      return lng;
    }
    return defaultLanguage;
  },
});


i18n
  .use(
    resourcesToBackend(
      (language: string) => import(`./languages/${language}.json`),
    ),
  )
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
  });

export const apiLanguage: { [key: string]: string } = {
  "zh-cn": "zh-tw",
};

export const getLanguage = (): string => {
  let language: string = window.localStorage.i18nextLng.toLowerCase();
  if (language in apiLanguage) {
    language = apiLanguage[language];
  }
  return language;
};

export default i18n;
