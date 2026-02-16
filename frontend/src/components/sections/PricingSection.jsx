/* eslint-disable react/prop-types */

import PricingCard from "../PricingCard";
import { RxCross2 } from "react-icons/rx";
import { useTranslation, Trans } from "react-i18next";

const PricingSection = ({ pricingRef }) => {
  const { t, i18n } = useTranslation();

  // Check if the user is viewing the site in French or English
  const isFrenchOrEnglish = i18n.language === "fr" || i18n.language === "en";

  // Pricing values based on language
  const pricing = {
    oneTime: isFrenchOrEnglish ? 1000 : 500,
    weekly: isFrenchOrEnglish ? 6000 : 5000,
    twoWeekly: isFrenchOrEnglish ? 10000 : 8000,
    monthly: isFrenchOrEnglish ? 15000 : 10000,
    kinyarwandaSpecial: i18n.language === "rw" ? 300 : null,
  };

  return (
    <section className="bg-white" ref={pricingRef}>
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-24 lg:px-6">
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 justify-center">
          {/* Pricing Card for Special Kinyarwanda Plan */}
          {pricing.kinyarwandaSpecial !== null && (
            <PricingCard
              cardTitle={t("pricingSection.kinyarwandaSpecial.title")}
              cardDescription={t(
                "pricingSection.kinyarwandaSpecial.description"
              )}
              cardPricing={pricing.kinyarwandaSpecial}
              cardCategory="kinyarwanda-special"
            >
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{t("pricingSection.kinyarwandaSpecial.feature1")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <RxCross2 color="red" />
                <span>{t("pricingSection.kinyarwandaSpecial.feature2")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <RxCross2 color="red" />
                <span>{t("pricingSection.kinyarwandaSpecial.feature3")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <Trans
                  i18nKey="pricingSection.kinyarwandaSpecial.feature4"
                  components={{ strong: <strong /> }}
                />
              </li>

            </PricingCard>
          )}

          {/* Pricing Card for One-Time */}
          <PricingCard
            cardTitle={t("pricingSection.oneTime.title")}
            cardDescription={t("pricingSection.oneTime.description")}
            cardPricing={pricing.oneTime}
            cardCategory="one-time"
          >
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{t("pricingSection.oneTime.feature1")}</span>
            </li>
            {!isFrenchOrEnglish && (
              <li className="flex items-center space-x-3">
                <RxCross2 color="red" />
                <span>{t("pricingSection.oneTime.feature2")}</span>
              </li>
            )}
            <li className="flex items-center space-x-3">
              <RxCross2 color="red" />
              <span>{t("pricingSection.oneTime.feature3")}</span>
            </li>
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Trans
                i18nKey="pricingSection.oneTime.feature4"
                components={{ strong: <strong /> }}
              />
            </li>
          </PricingCard>

          {/* Pricing Card for Weekly */}
          <PricingCard
            cardTitle={t("pricingSection.weekly.title")}
            cardCategory="weekly"
            cardPricing={pricing.weekly}
            cardDescription={t("pricingSection.weekly.description")}
          >
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{t("pricingSection.weekly.feature1")}</span>
            </li>
            {!isFrenchOrEnglish && (
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{t("pricingSection.weekly.feature2")}</span>
              </li>
            )}
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{t("pricingSection.weekly.feature3")}</span>
            </li>
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Trans
                i18nKey="pricingSection.weekly.feature4"
                components={{ strong: <strong /> }}
              />
            </li>
          </PricingCard>

          {/* Pricing Card for Two-Weekly */}
          <PricingCard
            cardTitle={t("pricingSection.twoWeekly.title")}
            cardDescription={t("pricingSection.twoWeekly.description")}
            cardPricing={pricing.twoWeekly}
            cardCategory="two-weekly"
          >
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{t("pricingSection.twoWeekly.feature1")}</span>
            </li>
            {!isFrenchOrEnglish && (
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{t("pricingSection.twoWeekly.feature2")}</span>
              </li>
            )}
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{t("pricingSection.twoWeekly.feature3")}</span>
            </li>
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Trans
                i18nKey="pricingSection.twoWeekly.feature4"
                components={{ strong: <strong /> }}
              />
            </li>
          </PricingCard>

          {/* Pricing Card for Monthly */}
          <PricingCard
            cardTitle={t("pricingSection.monthly.title")}
            cardDescription={t("pricingSection.monthly.description")}
            cardPricing={pricing.monthly}
            cardCategory="monthly"
          >
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{t("pricingSection.monthly.feature1")}</span>
            </li>
            {!isFrenchOrEnglish && (
              <li className="flex items-center space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{t("pricingSection.monthly.feature2")}</span>
              </li>
            )}
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{t("pricingSection.monthly.feature3")}</span>
            </li>
            <li className="flex items-center space-x-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Trans
                i18nKey="pricingSection.monthly.feature4"
                components={{ strong: <strong /> }}
              />
            </li>
          </PricingCard>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
