import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// 🛑 FIX: Import the necessary plugin for language persistence 🛑
import LanguageDetector from 'i18next-browser-languagedetector';

// --- 1. Define the Translations ---
const resources = {
  // English translations (en)
  en: {
    translation: {
      "app_name": "Ayoub's Portfolio",
      "nav_home": "Home",
      "nav_projects": "Projects",
      "nav_contact": "Contact",
      "greeting": "Hello, I'm Ayoub El Arabi. I build modern web solutions.",
      "project_title": "My Work Gallery",
      "project_view_link": "View Project",
      "contact_header": "Get in Touch",
      "home_bio": "I specialize in building responsive web applications using React and robust APIs with Node.js and MongoDB. My focus is on creating dynamic, user-friendly, and scalable digital solutions.",
      "skills_title": "My Core Skills",
      "contact_submit": "Send Message",
      "contact_intro": "Have a project idea or a question? Feel free to send me a message! I aim to respond within 24 hours.",
      "footer_rights": "All Rights Reserved."
    }
  },
  // French translations (fr)
  fr: {
    translation: {
      "app_name": "Portfolio d'Ayoub",
      "nav_home": "Accueil",
      "nav_projects": "Projets",
      "nav_contact": "Contact",
      "greeting": "Bonjour, je suis Ayoub El Arabi. Je conçois des solutions web modernes.",
      "project_title": "Ma Galerie de Travaux",
      "project_view_link": "Voir le Projet",
      "contact_header": "Contactez-moi",
      "home_bio": "Je me spécialise dans la construction d'applications web réactives avec React et d'APIs robustes avec Node.js et MongoDB. Mon objectif est de créer des solutions numériques dynamiques, conviviales et évolutives.",
      "skills_title": "Mes Compétences Clés",
      "contact_submit": "Envoyer le Message",
      "contact_intro": "Vous avez une idée de projet ou une question ? N'hésitez pas à m'envoyer un message ! Je m'efforce de répondre dans les 24 heures.",
      "footer_rights": "Tous droits réservés."
    }
  }
};

// --- 2. Initialize i18next ---
i18n
  // 🛑 FIX: Use the LanguageDetector to check for saved language preference 🛑
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources,
    
    // The LanguageDetector takes over the initial 'lng' setting.
    // If no language is found in storage, it will default to 'en'.
    // We can remove the `lng: "en"` line since `fallbackLng` handles the default.
    fallbackLng: "en", 

    // 🛑 FIX: Configuration for the LanguageDetector 🛑
    detection: {
      // Order of language detection: check localStorage first, then cookie, then browser default
      order: ['localStorage', 'cookie', 'navigator'], 
      // The key where the language will be saved in localStorage (standard i18next key)
      lookupLocalStorage: 'i18nextLng', 
      // Cache the language preference
      caches: ['localStorage'], 
    },
    
    interpolation: {
      escapeValue: false // react already protects against XSS
    }
  });

export default i18n;