import { FaCar } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { FaTrophy } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const SecondBlock = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-primary-100 h-full md:h-[20vh] flex items-center">
      <div className="max-w-screen-xl mx-auto py-4">
        <div className="flex justify-center space-x-0 md:space-x-10 flex-col md:flex-row items-center text-primary-700">
          <div className="flex items-center px-3 py-2 space-x-4 md:space-x-5">
            <FaCar className="text-4xl" />
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-medium">30,000+</h3>
              <h5>{t('students')}</h5>
            </div>
          </div>
          <div className="flex items-center px-3 py-2 space-x-4 md:space-x-5">
            <IoTime className="text-4xl" />
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium text-2xl">24/7</h3>
              <h5>{t('hours')}</h5>
            </div>
          </div>
          <div className="flex items-center px-3 py-2 space-x-4 md:space-x-5">
            <FaTrophy className="text-4xl" />
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium text-2xl">300+</h3>
              <h5>{t('exams')}</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondBlock;
