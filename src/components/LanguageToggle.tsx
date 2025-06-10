"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 px-3 py-1 rounded-full border border-current/30 hover:bg-current/10 transition-colors"
      aria-label={t("language.toggle")}
      data-oid="9vjp1_j"
    >
      <span
        className={language === "en" ? "font-bold" : "opacity-75"}
        data-oid="drs7:rv"
      >
        EN
      </span>
      <span className="opacity-60" data-oid="kb:5uxf">
        |
      </span>
      <span
        className={language === "ms" ? "font-bold" : "opacity-75"}
        data-oid="iu5ep6p"
      >
        BM
      </span>
    </button>
  );
}
