
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuBarIcon } from "./Icons";
import { checkTokenExpiry } from "../utils/checkTokenExpiry";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { LanguageContext } from "../contexts/LanguageContext";

const Navbar = ({
  scrollToSection,
  pricingRef,
  aboutRef,
  contactRef,
  aboutUs,
  Pricing,
  contactUs,
  doExam,
  hideLanguageSwitcher = true,
}) => {
  const menuRef = useRef(null);
  const token = Cookies.get("jwt");
  const decoded = token && jwtDecode(token);
  useContext(LanguageContext);
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const location = useLocation();

  const noLanguageSwitcherPaths = ["/"];
  const hideLanguageSwitcherPath = !noLanguageSwitcherPaths.includes(
    location.pathname
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (token && checkTokenExpiry(decoded.exp)) {
      Cookies.remove("jwt");
      setIsLoggedIn(false);
      navigate("/");
    }
  }, [token, decoded, navigate]);

  const toggleMenu = () => {
    setOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    Cookies.remove("jwt");
    navigate("/");
  };

  return (
    // <header className="sticky top-0 z-50 left-0 w-full">
    //   <nav className="bg-white border-b border-gray-200">
    //     <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
    //       <Link to="/">
    //         <img
    //           src="./images/new-logo.svg"
    //           className="h-12 sm:h-16 md:h-20 lg:h-22 object-cover"
    //           alt={t("logoAltText")}
    //         />
    //       </Link>

    //       {hideLanguageSwitcher && (
    //         <div className="lg:hidden px-1 list-none">
    //           <LanguageSwitcher />
    //         </div>
    //       )}

    //       <div className="flex  items-center lg:order-2">
    //         {!isLoggedIn && (
    //           <Link
    //             to="/signin"
    //             className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0"
    //           >
    //             {t("signIn")}
    //           </Link>
    //         )}
    //         {isLoggedIn && (
    //           <div
    //             className="relative bg-red-400 rounded-full cursor-pointer flex justify-center items-center text-white font-bold
    //          w-10 h-10 text-lg
    //          sm:w-8 sm:h-8 sm:text-base
    //          xs:w-6 xs:h-6 xs:text-sm"
    //             onClick={() => {
    //               setIsMenuOpen(false);
    //               setOpen(!open);
    //             }}
    //           >
    //             {decoded?.name.slice(0, 2).toUpperCase()}
    //           </div>
    //         )}
    //         {open && isLoggedIn && (
    //           <div className="absolute w-48 bg-white rounded-lg shadow-xl py-2 top-14 md:top-10 right-8 md:right-16 border border-gray-200 z-50">
    //             <Link
    //               to="/profile"
    //               className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors duration-200"
    //             >
    //               <FontAwesomeIcon icon="user-circle" className="mr-2" />
    //               {t("profile")}
    //             </Link>
    //             <hr className="my-1 border-gray-200" />
    //             <button
    //               onClick={handleLogout}
    //               className="w-full text-left px-4 py-2 text-red-500 hover:bg-blue-500 hover:text-white transition-colors duration-200"
    //             >
    //               <FontAwesomeIcon icon="sign-out-alt" className="mr-2" />
    //               {t("logout")}
    //             </button>
    //           </div>
    //         )}{" "}
    //         <button
    //           onClick={toggleMenu}
    //           type="button"
    //           className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
    //         >
    //           <MenuBarIcon />
    //         </button>
    //       </div>
    //       <div
    //         ref={menuRef}
    //         className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${
    //           isMenuOpen ? "block" : "hidden"
    //         }`}
    //         id="mobile-menu-2"
    //       >
    //         <ul className="flex flex-col mt-4 font-medium text-center lg:text-start lg:flex-row lg:space-x-8 lg:mt-0">
    //           <li>
    //             <Link
    //               to="/"
    //               className="block py-2 pl-3 pr-4 text-white bg-purple-700 rounded lg:bg-transparent lg:text-purple-700 lg:p-0"
    //               aria-current="page"
    //             >
    //               {t("home")}
    //             </Link>
    //           </li>
    //           {aboutUs && (
    //             <li
    //               onClick={() => scrollToSection(aboutRef)}
    //               className="cursor-pointer"
    //             >
    //               <span className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">
    //                 {t("aboutUs")}
    //               </span>
    //             </li>
    //           )}
    //           {Pricing && (
    //             <li
    //               onClick={() => scrollToSection(pricingRef)}
    //               className="cursor-pointer"
    //             >
    //               <span className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">
    //                 {t("pricing")}
    //               </span>
    //             </li>
    //           )}
    //           {doExam && (
    //             <li
    //               onClick={() => scrollToSection(contactRef)}
    //               className="cursor-pointer"
    //             >
    //               <Link
    //                 to="/user-dashboard"
    //                 className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0"
    //               >
    //                 {t("takeExam")}
    //               </Link>
    //             </li>
    //           )}
    //           {contactUs && (
    //             <li
    //               onClick={() => scrollToSection(contactRef)}
    //               className="cursor-pointer"
    //             >
    //               <span className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">
    //                 {t("contactUs")}
    //               </span>
    //             </li>
    //           )}

    //           {hideLanguageSwitcher && !hideLanguageSwitcherPath && (
    //             <div className="hidden md:block">
    //               <LanguageSwitcher />
    //             </div>
    //           )}
    //         </ul>
    //       </div>
    //     </div>
    //   </nav>
    // </header>
    <header className="sticky top-0 z-50 left-0 w-full">
  <nav className="bg-white border-b border-gray-200">
    <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto px-4 py-2">
      
      {/* Logo with responsive height */}
      <Link to="/">
        <img
          src="./images/logo.jpg"
          className="h-8 sm:h-12 md:h-16 lg:h-20 object-cover"
          alt={t("logoAltText")}
        />
      </Link>

      {/* Language Switcher for mobile screens */}
      {hideLanguageSwitcher && (
        <div className="lg:hidden px-1 list-none">
          <LanguageSwitcher />
        </div>
      )}

      {/* Sign-in button and user profile */}
      <div className="flex items-center lg:order-2 space-x-2">
        {!isLoggedIn ? (
          <Link
            to="/signin"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
          >
            {t("signIn")}
          </Link>
        ) : (
          <div
            className="relative bg-red-400 rounded-full cursor-pointer flex justify-center items-center text-white font-bold w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base"
            onClick={() => {
              setIsMenuOpen(false);
              setOpen(!open);
            }}
          >
            {decoded?.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        
        {/* Dropdown menu for logged-in user */}
        {open && isLoggedIn && (
          <div className="absolute w-48 bg-white rounded-lg shadow-xl py-2 top-14 md:top-10 right-8 md:right-16 border border-gray-200 z-50">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors duration-200 text-sm"
            >
              <FontAwesomeIcon icon="user-circle" className="mr-2" />
              {t("profile")}
            </Link>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-blue-500 hover:text-white transition-colors duration-200 text-sm"
            >
              <FontAwesomeIcon icon="sign-out-alt" className="mr-2" />
              {t("logout")}
            </button>
          </div>
        )}

        {/* Menu button for mobile screens */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <MenuBarIcon />
        </button>
      </div>

      {/* Navigation Menu */}
      <div
        ref={menuRef}
        className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${
          isMenuOpen ? "block" : "hidden"
        }`}
        id="mobile-menu-2"
      >
        <ul className="flex flex-col mt-4 font-medium text-center lg:text-start lg:flex-row lg:space-x-6 lg:mt-0 text-sm">
          <li>
            <Link
              to="/"
              className="block py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 text-xs sm:text-sm lg:text-base"
              aria-current="page"
            >
              {t("home")}
            </Link>
          </li>
          {aboutUs && (
            <li onClick={() => scrollToSection(aboutRef)} className="cursor-pointer">
              <span className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 text-xs sm:text-sm lg:text-base">
                {t("aboutUs")}
              </span>
            </li>
          )}
          {Pricing && (
            <li onClick={() => scrollToSection(pricingRef)} className="cursor-pointer">
              <span className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 text-xs sm:text-sm lg:text-base">
                {t("pricing")}
              </span>
            </li>
          )}
          {doExam && (
            <li onClick={() => scrollToSection(contactRef)} className="cursor-pointer">
              <Link
                to="/user-dashboard"
                className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 text-xs sm:text-sm lg:text-base"
              >
                {t("takeExam")}
              </Link>
            </li>
          )}
          {contactUs && (
            <li onClick={() => scrollToSection(contactRef)} className="cursor-pointer">
              <span className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 text-xs sm:text-sm lg:text-base">
                {t("contactUs")}
              </span>
            </li>
          )}

          {/* Language Switcher for larger screens */}
          {hideLanguageSwitcher && !hideLanguageSwitcherPath && (
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
          )}
        </ul>
      </div>
    </div>
  </nav>
</header>

  );
};

export default Navbar;
