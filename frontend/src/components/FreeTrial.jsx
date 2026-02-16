import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; 

const FreeTrial = () => {
  const { t } = useTranslation(); 

  return (
    <section className="bg-gray-50">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-sm mx-auto text-center">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900">
            {t('FreeTrial.Title')}
          </h2>
          <p className="mb-6 font-light text-gray-500 md:text-lg">
            {t('FreeTrial.Description')}
          </p>
          <Link 
            to={"/user-dashboard"} 
            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
          >
            {t('FreeTrial.StartNow')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FreeTrial;
