import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Define only the namespaces currently needed
const namespaces = ['app', 'home', 'about', 'contact', 'system', 'dashboard', 'observations'];

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: namespaces, // Use the simplified list
    defaultNS: 'app',
    supportedLngs: ['en', 'es'],
    fallbackLng: 'en',
    debug: true, // Change to false for production
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
