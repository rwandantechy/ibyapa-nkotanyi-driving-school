/* eslint-disable react/prop-types */
import { MdPlace } from "react-icons/md";
import { useTranslation } from 'react-i18next';

const AboutSection = ({ aboutRef }) => {
  const { t } = useTranslation();

  // SVG Icon component for reusability
  const CheckIcon = () => (
    <svg
      className="flex-shrink-0 w-5 h-5 text-purple-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      ></path>
    </svg>
  );

  const FeatureListItem = ({ text }) => (
    <li className="flex space-x-3">
      <CheckIcon />
      <span className="text-base font-medium leading-tight text-gray-900">
        {text}
      </span>
    </li>
  );

  return (
    <section className="bg-gray-50" ref={aboutRef}>
      <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
          
          {/* Left Column */}
          <div className="text-gray-500 sm:text-lg">
            <h2 className="max-w-2xl mb-4 text-2xl font-medium tracking-tight md:text-xl xl:text-3xl text-primary-700">
              {t('aboutSection.title')}
            </h2>
            <p className="mb-8 font-light lg:text-xl">
              {t('aboutSection.description')}
            </p>

            <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 my-7">
              <FeatureListItem text={t('aboutSection.feature1')} />
              <FeatureListItem text={t('aboutSection.feature2')} />
              <FeatureListItem text={t('aboutSection.feature3')} />
            </ul>

            <p className="mb-8 font-light lg:text-xl">
              {t('aboutSection.additionalInfo')}
            </p>

            <div className="flex flex-col gap-2 font-semibold pt-4">
              <p className="uppercase">{t('aboutSection.teacher')}</p>
              <p className="flex items-center gap-2">
                <MdPlace />
                {t('aboutSection.location')}
              </p>
              <p>{t('aboutSection.teaching')}</p>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="text-gray-500 sm:text-lg mt-8 pt-5">
            <p className="mb-8 font-light lg:text-xl">
              {t('aboutSection.vision')}
            </p>

            <h2 className="max-w-2xl mb-4 text-lg font-medium tracking-tight md:text-lg xl:text-xl text-primary-900">
              {t('aboutSection.futureVisionTitle')}
            </h2>
            
            <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 my-7">
              <FeatureListItem text={t('aboutSection.futureGoal1')} />
              <FeatureListItem text={t('aboutSection.futureGoal2')} />
              <FeatureListItem text={t('aboutSection.futureGoal3')} />
            </ul>

            <p className="mb-8 font-light lg:text-xl">
              {t('aboutSection.finalGoal')}
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
