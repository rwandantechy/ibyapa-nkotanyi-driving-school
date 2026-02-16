/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { LanguageContext } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const { language, changeLanguage } = useContext(LanguageContext);
  const [currentLang, setCurrentLang] = useState(language);

  const languageOptions = {
    rw: { label: t("Kinyarwanda"), flag: "/images/flags/rw.png" },
    fr: { label: t("French"), flag: "/images/flags/fr.png" },
    en: { label: t("English"), flag: "/images/flags/en.png" },
  };

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleChangeLanguage = (lang) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    changeLanguage(lang);
    Cookies.set("lang", lang, { expires: 28 });
    setIsLangDropdownOpen(false);
  };

  useEffect(() => {
    const savedLang = Cookies.get("lang") || "rw";
    setCurrentLang(savedLang);
    i18n.changeLanguage(savedLang);
    changeLanguage(savedLang);
  }, []);

  return (
    <li className="relative right-4 z-50">
      <button
        onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
        className="inline-flex items-center px-4 py-1 text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 
        text-xs sm:text-sm" 
        type="button"
      >
        <img
          src={languageOptions[currentLang]?.flag}
          alt={languageOptions[currentLang]?.label}
          className="w-5 h-3 mr-2 sm:w-6 sm:h-4"
        />
        <span>{languageOptions[currentLang]?.label}</span>
        <svg
          className="w-3 h-3 ml-2 -mr-1 sm:w-4 sm:h-4" 
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isLangDropdownOpen && (
        <div className="absolute z-10 w-44 mt-2 origin-top-right left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-sm">
          <ul className="py-1 text-xs text-gray-700 text-center lg:text-start">
            {Object.keys(languageOptions).map((langCode) => (
              <li key={langCode} className="text-left">
                <button
                  onClick={() => handleChangeLanguage(langCode)}
                  className="block w-full px-4 py-2 text-gray-700 hover:text-purple-800 hover:bg-purple-200 text-left"
                >
                  <img
                    src={languageOptions[langCode]?.flag}
                    alt={languageOptions[langCode]?.label}
                    className="w-5 h-3 inline-block mr-2 sm:w-6 sm:h-4"
                  />
                  {languageOptions[langCode]?.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default LanguageSwitcher;
