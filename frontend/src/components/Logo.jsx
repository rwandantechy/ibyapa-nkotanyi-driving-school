/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useTranslation } from "react-i18next";

// Reusable brand Logo component to ensure consistent logo usage everywhere
// Props:
// - size: one of "xs" | "sm" | "md" | "lg" | "xl" (controls height)
// - withText: boolean to render brand name next to the logo
// - className: extra classes for the wrapper
// - imgClassName: extra classes for the img
// - textClassName: classes for the brand text
// - src: override image source if needed (defaults to the blue round logo)
export default function Logo({
  size = "md",
  withText = false,
  className = "",
  imgClassName = "",
  textClassName = "",
  src = "/images/logo.jpg",
}) {
  const { t } = useTranslation();

  const sizeMap = {
    xs: "h-5",
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
    xl: "h-16",
  };

  const imgSize = sizeMap[size] || sizeMap.md;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={src}
        alt={t("logoAltText", { defaultValue: "NKOTANYI Driving School logo" })}
        className={`${imgSize} object-contain ${imgClassName}`}
      />
      {withText && (
        <span
          className={`text-primary-700 font-extrabold tracking-tight ${
            size === "xs"
              ? "text-xs"
              : size === "sm"
              ? "text-sm"
              : size === "md"
              ? "text-base"
              : size === "lg"
              ? "text-lg"
              : "text-xl"
          } ${textClassName}`}
        >
          {t("brand.name", { defaultValue: "NKOTANYI DRIVING SCHOOL" })}
        </span>
      )}
    </span>
  );
}
