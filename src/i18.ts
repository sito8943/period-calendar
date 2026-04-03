import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { namespaces } from "./lang/nameSpaces.ts";

// resources
// es
import esAccessibility from "./lang/es/_accessibility.json";
import esPages from "./lang/es/_pages.json";
import esPagesBoy from "./lang/es/_pages_boy.json";
import esEntities from "./lang/es/_entities.json";
// en
import enAccessibility from "./lang/en/_accessibility.json";
import enPages from "./lang/en/_pages.json";
import enPagesBoy from "./lang/en/_pages_boy.json";
import enEntities from "./lang/en/_entities.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    supportedLngs: ["es", "en", "es-x-boy", "en-x-boy"],
    ns: namespaces,
    defaultNS: "_pages",
    resources: {
      es: {
        _accessibility: esAccessibility,
        _pages: esPages,
        _entities: esEntities,
      },
      en: {
        _accessibility: enAccessibility,
        _pages: enPages,
        _entities: enEntities,
      },
      "es-x-boy": {
        _pages: esPagesBoy,
      },
      "en-x-boy": {
        _pages: enPagesBoy,
      },
    },
  });
