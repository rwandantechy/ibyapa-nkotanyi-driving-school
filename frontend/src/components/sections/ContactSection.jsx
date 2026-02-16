/* eslint-disable react/prop-types */
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from 'react-i18next'; 

const ContactSection = ({ contactRef }) => {
  const { t } = useTranslation(); 

  return (
    <section className="bg-white" ref={contactRef}>
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">
          {t('ContactSection.Title')}
        </h2>
        <p className="mb-4 lg:mb-12 font-light text-center text-gray-500 sm:text-xl">
          {t('ContactSection.Description')}
        </p>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-4 text-lg">
              <span>{t('ContactSection.EmailLabel')}</span>
              <span className="text-gray-500">{t('ContactSection.Email')}</span>
            </div>
            <div className="flex space-x-4 text-lg">
              <span>{t('ContactSection.PhoneLabel')}</span>
              <span className="text-gray-500">{t('ContactSection.Phone')}</span>
            </div>
          </div>

          <div className="flex justify-center w-full mt-8">
            <a
              href="https://wa.me/250780211466"
              rel="noreferrer"
              target="_blank"
              className="font-medium flex items-center"
            >
              <FaWhatsapp className="text-green-500 cursor-pointer" size={50} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
