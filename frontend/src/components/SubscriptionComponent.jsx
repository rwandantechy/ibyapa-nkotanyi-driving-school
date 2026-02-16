/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SubscriptionComponent = ({ children }) => {
  const { t } = useTranslation(); 

  return (
    <div className="w-full bg-red-500 md:w-1/2 flex flex-col space-y-5 mx-auto mt-3">
      {children}
      <Link to="/payment" className="bg-primary-700 px-2 py-2 text-white font-bold rounded-md w-1/2 md:w-1/3 mx-auto">
        {t("SubscriptionComponent.Pay")} 
      </Link>
    </div>
  );
};

export default SubscriptionComponent;

