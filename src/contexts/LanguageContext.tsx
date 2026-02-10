import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi" | "hinglish";

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    hinglish: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", hi: "होम", hinglish: "Home" },
  "nav.tools": { en: "Tools", hi: "टूल्स", hinglish: "Tools" },
  "nav.services": { en: "Services", hi: "सेवाएं", hinglish: "Services" },
  "nav.notes": { en: "Notes", hi: "नोट्स", hinglish: "Notes" },
  "nav.prompts": { en: "Prompts", hi: "प्रॉम्प्ट्स", hinglish: "Prompts" },
  "nav.mindmaps": { en: "Mindmaps", hi: "माइंडमैप्स", hinglish: "Mindmaps" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", hinglish: "Dashboard" },
  "nav.login": { en: "Login", hi: "लॉगिन", hinglish: "Login" },
  "nav.signup": { en: "Sign Up", hi: "साइन अप", hinglish: "Sign Up" },
  "nav.logout": { en: "Logout", hi: "लॉगआउट", hinglish: "Logout" },

  // Hero Section
  "hero.badge": { en: "Digital Marketplace", hi: "डिजिटल मार्केटप्लेस", hinglish: "Digital Marketplace" },
  "hero.title": { en: "Scale your vision with elite digital tools.", hi: "एलीट डिजिटल टूल्स के साथ अपने विज़न को स्केल करें।", hinglish: "Elite digital tools ke saath apne vision ko scale karo." },
  "hero.subtitle": { en: "A curated marketplace connecting ambitious builders with high-performance assets and the world's top digital professionals.", hi: "महत्वाकांक्षी बिल्डर्स को हाई-परफॉर्मेंस एसेट्स से जोड़ने वाला एक क्यूरेटेड मार्केटप्लेस।", hinglish: "Ambitious builders ko high-performance assets se connect karne wala ek curated marketplace." },
  "hero.browseTools": { en: "Browse Tools", hi: "टूल्स देखें", hinglish: "Tools Dekho" },
  "hero.exploreServices": { en: "Explore Services", hi: "सेवाएं देखें", hinglish: "Services Explore Karo" },

  // Sections
  "section.trending": { en: "Trending", hi: "ट्रेंडिंग", hinglish: "Trending" },
  "section.featuredTools": { en: "Featured Digital Tools", hi: "फीचर्ड डिजिटल टूल्स", hinglish: "Featured Digital Tools" },
  "section.featuredToolsDesc": { en: "Verified assets for high-growth projects", hi: "हाई-ग्रोथ प्रोजेक्ट्स के लिए वेरिफाइड एसेट्स", hinglish: "High-growth projects ke liye verified assets" },
  "section.featuredServices": { en: "Featured Services", hi: "फीचर्ड सर्विसेज", hinglish: "Featured Services" },
  "section.featuredServicesDesc": { en: "Direct access to elite professional talent", hi: "एलीट प्रोफेशनल टैलेंट तक सीधी पहुंच", hinglish: "Elite professional talent tak direct access" },
  "section.notes": { en: "Premium Notes", hi: "प्रीमियम नोट्स", hinglish: "Premium Notes" },
  "section.notesDesc": { en: "High-quality study materials and guides", hi: "उच्च गुणवत्ता वाली अध्ययन सामग्री", hinglish: "High-quality study materials aur guides" },
  "section.prompts": { en: "AI Prompts", hi: "AI प्रॉम्प्ट्स", hinglish: "AI Prompts" },
  "section.promptsDesc": { en: "Ready-to-use prompts for various AI models", hi: "विभिन्न AI मॉडल्स के लिए रेडी-टू-यूज प्रॉम्प्ट्स", hinglish: "Various AI models ke liye ready-to-use prompts" },
  "section.mindmaps": { en: "Mindmaps", hi: "माइंडमैप्स", hinglish: "Mindmaps" },
  "section.mindmapsDesc": { en: "Visual learning resources and diagrams", hi: "विज़ुअल लर्निंग रिसोर्सेज़ और डायग्राम्स", hinglish: "Visual learning resources aur diagrams" },
  "section.uiux": { en: "UI/UX Designs", hi: "UI/UX डिज़ाइन्स", hinglish: "UI/UX Designs" },
  "section.uiuxDesc": { en: "Professional design templates and kits", hi: "प्रोफेशनल डिज़ाइन टेम्पलेट्स और किट्स", hinglish: "Professional design templates aur kits" },
  "section.animations": { en: "Loading Animations", hi: "लोडिंग एनिमेशन्स", hinglish: "Loading Animations" },
  "section.animationsDesc": { en: "Smooth loading animations for your projects", hi: "आपके प्रोजेक्ट्स के लिए स्मूथ लोडिंग एनिमेशन्स", hinglish: "Aapke projects ke liye smooth loading animations" },
  "section.fonts": { en: "Premium Fonts", hi: "प्रीमियम फॉन्ट्स", hinglish: "Premium Fonts" },
  "section.fontsDesc": { en: "Unique typography for standout designs", hi: "बेहतरीन डिज़ाइन्स के लिए यूनिक टाइपोग्राफी", hinglish: "Standout designs ke liye unique typography" },
  "section.templates": { en: "Website Templates", hi: "वेबसाइट टेम्पलेट्स", hinglish: "Website Templates" },
  "section.templatesDesc": { en: "Ready-to-deploy website templates", hi: "रेडी-टू-डिप्लॉय वेबसाइट टेम्पलेट्स", hinglish: "Ready-to-deploy website templates" },
  "section.sponsored": { en: "Sponsored & Featured", hi: "स्पॉन्सर्ड और फीचर्ड", hinglish: "Sponsored & Featured" },
  "section.sponsoredDesc": { en: "Premium tools handpicked for you", hi: "आपके लिए चुने गए प्रीमियम टूल्स", hinglish: "Aapke liye handpicked premium tools" },
  "section.freelancers": { en: "Top Freelancers", hi: "टॉप फ्रीलांसर्स", hinglish: "Top Freelancers" },
  "section.freelancersDesc": { en: "Hire elite freelance professionals for your projects", hi: "अपने प्रोजेक्ट्स के लिए एलीट फ्रीलांस प्रोफेशनल्स को हायर करें", hinglish: "Apne projects ke liye elite freelance professionals hire karo" },

  // Common
  "common.viewAll": { en: "View All", hi: "सभी देखें", hinglish: "Sab Dekho" },
  "common.viewDetails": { en: "View Details", hi: "विवरण देखें", hinglish: "Details Dekho" },
  "common.buyNow": { en: "Buy Now", hi: "अभी खरीदें", hinglish: "Abhi Kharido" },
  "common.free": { en: "Free", hi: "मुफ्त", hinglish: "Free" },
  "common.download": { en: "Download", hi: "डाउनलोड", hinglish: "Download" },
  "common.purchased": { en: "Purchased", hi: "खरीदा गया", hinglish: "Kharida Gaya" },
  "common.browseMarketplace": { en: "Browse Marketplace", hi: "मार्केटप्लेस देखें", hinglish: "Marketplace Dekho" },

  // Settings
  "settings.title": { en: "Settings", hi: "सेटिंग्स", hinglish: "Settings" },
  "settings.language": { en: "Language", hi: "भाषा", hinglish: "Bhaasha" },
  "settings.languageDesc": { en: "Choose your preferred language", hi: "अपनी पसंदीदा भाषा चुनें", hinglish: "Apni pasandida bhaasha chuno" },
  "settings.theme": { en: "Theme", hi: "थीम", hinglish: "Theme" },
  "settings.account": { en: "Account", hi: "अकाउंट", hinglish: "Account" },
  "settings.security": { en: "Security", hi: "सुरक्षा", hinglish: "Security" },
  "settings.notifications": { en: "Notifications", hi: "नोटिफिकेशन्स", hinglish: "Notifications" },
  "settings.billing": { en: "Billing", hi: "बिलिंग", hinglish: "Billing" },
  "settings.appearance": { en: "Appearance", hi: "अपीयरेंस", hinglish: "Appearance" },

  // Plans
  "plan.upgrade": { en: "Upgrade Plan", hi: "प्लान अपग्रेड करें", hinglish: "Plan Upgrade Karo" },
  "plan.current": { en: "Current Plan", hi: "वर्तमान प्लान", hinglish: "Current Plan" },
  "plan.free": { en: "Free", hi: "मुफ्त", hinglish: "Free" },
  "plan.pro": { en: "Pro", hi: "प्रो", hinglish: "Pro" },
  "plan.enterprise": { en: "Enterprise", hi: "एंटरप्राइज", hinglish: "Enterprise" },
  "plan.accessRestricted": { en: "Upgrade your plan to access this feature", hi: "इस फीचर को एक्सेस करने के लिए प्लान अपग्रेड करें", hinglish: "Is feature ko access karne ke liye plan upgrade karo" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : language === "hinglish" ? "hi-Latn" : "en";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
