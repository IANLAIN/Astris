import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { T } from './content';

// T is currently Record<Lang, Record<string, any>>
const resources = {
  es: { translation: T.es },
  en: { translation: T.en },
  pt: { translation: T.pt },
  fr: { translation: T.fr }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
