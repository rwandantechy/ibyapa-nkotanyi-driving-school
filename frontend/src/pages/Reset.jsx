import { useTranslation } from 'react-i18next';
import AuthenticationContainer from '../components/AuthenticationContainer';
import { FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';

const Reset = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AuthenticationContainer heroImg="Reset.jpg">
        <div className="w-full max-w-md mx-auto space-y-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('Reset.ContactAdminTitle')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('Reset.ContactAdminMessage')}
          </p>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4 text-lg">
                <FaEnvelope className="text-indigo-600" />
                <span className="font-medium">{t('ContactSection.EmailLabel')}</span>
                <span className="text-gray-500">{t('ContactSection.Email')}</span>
              </div>
              <div className="flex items-center space-x-4 text-lg">
                <FaPhone className="text-indigo-600" />
                <span className="font-medium">{t('ContactSection.PhoneLabel')}</span>
                <span className="text-gray-500">{t('ContactSection.Phone')}</span>
              </div>
            </div>
            <div className="mt-6">
              <a
                href="https://wa.me/250780211466"
                rel="noreferrer"
                target="_blank"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                <FaWhatsapp className="mr-2" size={20} />
                {t('ContactSection.WhatsAppButton')}
              </a>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              {t('Reset.HomeButton')}
            </a>
          </div>
        </div>
      </AuthenticationContainer>
    </div>
  );
};

export default Reset;