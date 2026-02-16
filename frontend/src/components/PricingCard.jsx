/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next';



import { Link } from "react-router-dom";

const PricingCard = ({
  children,
  cardTitle,
  cardDescription,
  cardPricing,
  cardCategory,

}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow">
      <h3 className="mb-4 text-xl font-semibold">{cardTitle}</h3>
      <p className="font-light text-gray-500 sm:text-lg">{cardDescription}</p>
      <div className="flex items-baseline justify-center my-8">
        <span className="mr-2 text-3xl font-extrabold">{cardPricing} RWF</span>
      </div>
      <ul role="list" className="mb-4 space-y-4 text-left">
        {children}
      </ul>
      <div className="mt-auto ">
        <Link
          to={`/payment?category=${cardCategory}`}
          className="inline-block w-3/5 max-w-xs text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 font-medium rounded-lg text-sm px-3 py-2.5 text-center"
        >
        {/* use translation of cta */}
          {t('cta')}
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;
