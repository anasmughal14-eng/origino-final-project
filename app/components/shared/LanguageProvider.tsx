"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "ur";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.marketplace": "Marketplace",
    "nav.clusters": "Clusters",
    "nav.compare": "Compare",
    "nav.audit": "AI Audit",
    "nav.packages": "Packages",
    "nav.resources": "Resources",
    "nav.exportGuides": "Export Guides",
    "nav.costCalculator": "Cost Calculator",
    "nav.logistics": "Logistics",
    "nav.community": "Community",
    "nav.journal": "Journal",
    "nav.awards": "Awards",
    "nav.signIn": "Sign In",
    "lang.urdu": "اردو",
    "footer.tagline": "Curated Pakistani Manufacturing",
    "footer.body": "Good work exists here. ORIGINO gives it a clearer way to be seen.",
    "footer.certification": "Featured Certification",
    "footer.certified": "ORIGINO Certified",
    "footer.browseSuppliers": "Browse Suppliers",
    "footer.marketingPackages": "Marketing Packages",
    "footer.logisticsPartners": "Logistics Partners",
    "footer.platformStatus": "Platform Status",
    "footer.exportDocumentation": "Export Documentation",
    "footer.landedCost": "Landed Cost Calculator",
    "footer.tradeCommunity": "Trade Community",
    "footer.resourceLibrary": "Resource Library",
    "footer.ourStory": "Our Story",
    "footer.company": "Company",
    "footer.manufacturers": "For Manufacturers",
    "footer.buyers": "For Buyers",
    "footer.agents": "For Agents",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.rights": "© 2026 ORIGINO. All rights reserved.",
    "footer.marketplaceLine": "A curated sourcing layer for Pakistani manufacturing",
    "awards.title": "Supplier Awards",
    "awards.allQuarters": "All quarters",
    "awards.allCategories": "All categories",
    "awards.empty": "No awards match this period and category.",
    "awards.rank": "Rank",
    "awards.unavailable": "Supplier unavailable",
    "clusters.eyebrow": "Manufacturing Clusters",
    "clusters.title": "Five cities. Different kinds of work.",
    "clusters.description": "Each cluster carries a different manufacturing language. ORIGINO keeps that context close to the listing.",
    "clusters.annualExports": "Annual Exports",
    "cluster.verifiedSuppliers": "Verified suppliers",
    "cluster.primaryCategories": "Primary categories",
    "cluster.exportShare": "Export share",
    "cluster.browseSuppliers": "Browse Suppliers",
    "cluster.featuredSuppliers": "Featured Suppliers",
  },
  ur: {
    "nav.marketplace": "مارکیٹ پلیس",
    "nav.clusters": "کلسٹرز",
    "nav.compare": "موازنہ",
    "nav.audit": "AI آڈٹ",
    "nav.packages": "پیکیجز",
    "nav.resources": "وسائل",
    "nav.exportGuides": "ایکسپورٹ گائیڈز",
    "nav.costCalculator": "لاگت کیلکولیٹر",
    "nav.logistics": "لاجسٹکس",
    "nav.community": "کمیونٹی",
    "nav.journal": "جرنل",
    "nav.awards": "ایوارڈز",
    "nav.signIn": "سائن اِن",
    "lang.urdu": "اردو",
    "footer.tagline": "پاکستان کی بہترین ایکسپورٹ مارکیٹ پلیس",
    "footer.body": "دنیا کے خریداروں کو پاکستان کے ماہر کاریگروں سے جوڑتا ہے۔ منتخب، تصدیق شدہ، قابل اعتماد۔",
    "footer.certification": "نمایاں سرٹیفکیشن",
    "footer.certified": "ORIGINO تصدیق شدہ",
    "footer.browseSuppliers": "سپلائرز دیکھیں",
    "footer.marketingPackages": "مارکیٹنگ پیکیجز",
    "footer.logisticsPartners": "لاجسٹکس پارٹنرز",
    "footer.platformStatus": "پلیٹ فارم اسٹیٹس",
    "footer.exportDocumentation": "ایکسپورٹ دستاویزات",
    "footer.landedCost": "لینڈڈ کاسٹ کیلکولیٹر",
    "footer.tradeCommunity": "ٹریڈ کمیونٹی",
    "footer.resourceLibrary": "ریسورس لائبریری",
    "footer.ourStory": "ہماری کہانی",
    "footer.company": "کمپنی",
    "footer.manufacturers": "مینوفیکچررز کے لیے",
    "footer.buyers": "خریداروں کے لیے",
    "footer.agents": "ایجنٹس کے لیے",
    "footer.privacy": "پرائیویسی پالیسی",
    "footer.terms": "شرائط",
    "footer.rights": "© 2026 ORIGINO۔ جملہ حقوق محفوظ ہیں۔",
    "footer.marketplaceLine": "پاکستان کی پہلی منتخب B2B ایکسپورٹ مارکیٹ پلیس",
    "awards.title": "سپلائر ایوارڈز",
    "awards.allQuarters": "تمام سہ ماہی",
    "awards.allCategories": "تمام کیٹیگریز",
    "awards.empty": "اس مدت اور کیٹیگری کے لیے کوئی ایوارڈ نہیں ملا۔",
    "awards.rank": "رینک",
    "awards.unavailable": "سپلائر دستیاب نہیں",
    "clusters.eyebrow": "مینوفیکچرنگ کلسٹرز",
    "clusters.title": "پانچ شہر۔ ایک قوم کی ایکسپورٹ میراث۔",
    "clusters.description": "پاکستان کی صنعتی مہارت پانچ اہم کلسٹرز میں موجود ہے، ہر ایک اپنی جگہ عالمی معیار رکھتا ہے۔",
    "clusters.annualExports": "سالانہ ایکسپورٹس",
    "cluster.verifiedSuppliers": "تصدیق شدہ سپلائرز",
    "cluster.primaryCategories": "بنیادی کیٹیگریز",
    "cluster.exportShare": "ایکسپورٹ شیئر",
    "cluster.browseSuppliers": "سپلائرز دیکھیں",
    "cluster.featuredSuppliers": "نمایاں سپلائرز",
  },
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("origino_lang") === "ur" ? "ur" : "en";
    setLanguage(saved);
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === "ur" ? "rtl" : "ltr";
  }, []);

  function setLang(next: Language) {
    setLanguage(next);
    localStorage.setItem("origino_lang", next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ur" ? "rtl" : "ltr";
  }

  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    setLang,
    t: (key: string) => translations[lang][key] ?? translations.en[key] ?? key,
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
