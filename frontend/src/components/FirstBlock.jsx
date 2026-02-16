import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* eslint-disable react/prop-types */
const FirstBlock = ({ aboutRef, scrollToSection }) => {
  const { t } = useTranslation();

  return (
    <section className="bg-white container mx-auto h-[60vh] md:h-[70vh]">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-20 items-center h-full">
        <div className="mr-auto place-self-center lg:col-span-7 gap-y-10">
          <h1 className="max-w-2xl mb-4 text-2xl font-medium leading-none tracking-tight text-center md:text-left md:text-xl xl:text-3xl text-primary-700">
            {t("Intro.FirstBlockTitle")}
          </h1>

         <p className="max-w-2xl mb-6 font-light text-gray-500 text-justify md:text-left lg:mb-8 md:text-md lg:text-lg">
  {t("Intro.FirstBlockDescription")}
</p>

          <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <a
              href="#"
              className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 "
              onClick={() => scrollToSection(aboutRef)}
            >
              {t("Intro.LearnMore")}
            </a>
            <Link
              to="/user-dashboard"
              className="inline-flex items-center justify-center w-full px-5 py-3 mb-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:w-auto focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
            >
              {t("Intro.StartNow")}
            </Link>
          </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex ">
          <img src="./images/Nkotanyi.png" alt="hero image" />
        </div>
      </div>
    </section>
  );
};

export default FirstBlock;
