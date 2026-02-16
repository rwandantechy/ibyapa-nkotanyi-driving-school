/* eslint-disable react-refresh/only-export-components */
// src/context/LanguageContext.js
import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Cookies from "js-cookie";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(Cookies.get("lang") || "rw");

  useEffect(() => {
    if (!Cookies.get("lang")) {
      Cookies.set("lang", "rw", { expires: 28 });
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    Cookies.set("lang", newLanguage, { expires: 28 });
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LanguageProvider;