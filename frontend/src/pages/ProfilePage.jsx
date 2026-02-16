/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// import Footer from "../components/sections/Footer";
// import Navbar from "../components/Navbar";
// import EditProfile from "../components/EditProfile";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { getSingleUser } from "../redux/api-calls/user";
// import { checkTokenExpiry } from "../utils/checkTokenExpiry";
// import { useTranslation } from "react-i18next";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faLanguage,
//   faPhone,
//   faCreditCard,
//   faEdit,
//   faReceipt,
//   faCalendarCheck,
//   faCalendarAlt,
//   faCheckCircle,
//   faTimesCircle

// } from "@fortawesome/free-solid-svg-icons";

// export const ProfilePage = () => {
//   const { t } = useTranslation();
//   const token = Cookies.get("jwt");
//   const decoded = token && jwtDecode(token);
//   const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
//   const [profileEdited, setProfileEdited] = useState(false);
//   const [userProfile, setUserProfile] = useState({});

//   const openEditProfile = () => setIsEditProfileOpen(true);
//   const closeEditProfile = () => {
//     setIsEditProfileOpen(false);
//     if (profileEdited) getUserProfile();
//   };

//   const getUserProfile = () => {
//     getSingleUser(decoded.id, token)
//       .then((res) => setUserProfile(res.data))
//       .catch((err) => console.error("Error fetching user profile:", err));
//   };

//   useEffect(() => {
//     getUserProfile();
//   }, []);

//   if (!token || checkTokenExpiry(decoded.exp)) return <Navigate to="/signin" />;
//   if (token && decoded?.role === "admin") return <Navigate to="/dashboard" />;

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       <Navbar />
//       <div className="flex-grow container mx-auto p-4 md:p-8">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row mt-6 gap-8">
//           <div className="flex-1 bg-white rounded-lg shadow-lg p-8 mb-6 md:mb-0 transition-all duration-300 hover:shadow-xl">
//             <h2 className="text-2xl font-bold mb-6 text-primary-800 border-b pb-2">
//               {t("ProfilePage.MyAccount")}
//             </h2>
//             <div className="space-y-4">
//               <ProfileItem
//                 icon={faUser}
//                 label={t("ProfilePage.Name")}
//                 value={userProfile?.user?.name}
//               />
//               <ProfileItem
//                icon={faLanguage}
//                 label={t("ProfilePage.Language")}
//                 value={
//                   userProfile?.user?.language === "en"
//                     ? "English"
//                     : userProfile?.user?.language === "fr"
//                     ? "French"
//                     : userProfile?.user?.language === "rw"
//                     ? "Kinyarwanda"
//                     : t("ProfilePage.languageNotProvided")
//                 }
//               />
//               <ProfileItem
//                 icon={faPhone}
//                 label={t("ProfilePage.Phone")}
//                 value={userProfile?.user?.phone}
//               />
//             </div>
//             <button
//               className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center"
//               onClick={openEditProfile}
//             >
//               <FontAwesomeIcon icon={faEdit} className="mr-2" />
//               {t("ProfilePage.Edit")}
//             </button>
//           </div>
//           <div className="flex-1 bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
//             <h2 className="text-2xl font-bold mb-6 text-primary-800 border-b pb-2">
//               {t("ProfilePage.AccountInformation")}
//             </h2>
//             <div className="mb-3 mt-3">
//               <h3 className="mb-2 font-bold text-lg">
//                 <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-600" />{" "}
//                 {t("ProfilePage.PaymentPeriod")}
//               </h3>

//               <div>
//                 <p className="pl-8 my-3  rounded-md flex items-center">
//                   {userProfile?.payment && userProfile?.payment.length > 0
//                     ? userProfile.payment[0].subscription_type === "two-exams"
//                       ? t("ProfilePage.TwoExams")
//                       : userProfile.payment[0].subscription_type ===
//                         "five-exams"
//                       ? t("ProfilePage.FiveExams")
//                       : userProfile.payment[0].subscription_type === "weekly"
//                       ? t("ProfilePage.Weekly")
//                       : userProfile.payment[0].subscription_type ===
//                         "two-weekly"
//                       ? t("ProfilePage.TwoWeekly")
//                       : userProfile.payment[0].subscription_type === "monthly"
//                       ? t("ProfilePage.Monthly")
//                       : t("ProfilePage.UnknownSubscription")
//                     : t("ProfilePage.Free")}
//                 </p>
//               </div>

//               <div>
//                 <h4 className="mb-4 font-bold text-md">
//                   <FontAwesomeIcon icon={faCalendarCheck} className="mr-2 text-blue-600" />{" "}
//                   {t("ProfilePage.PaymentPeriodEnd")}
//                 </h4>
//                 <span className="pl-8 my-3 rounded-md flex items-center">
//                   {userProfile?.payment &&
//                   userProfile?.payment.length > 0 &&
//                   userProfile.payment[0].subscriptionEnd
//                     ? new Date(
//                         userProfile.payment[0].subscriptionEnd
//                       ).toLocaleDateString()
//                     : t("ProfilePage.ExamNumberBased")}
//                 </span>
//               </div>
//               <div>
//                 <h4 className="mb-4 font-bold text-md">
//                   <FontAwesomeIcon
//                     icon={faReceipt}
//                     className="mr-2 text-blue-600"
//                   />
//                   {t("ProfilePage.PaymentStatus")}
//                 </h4>
//                 <span
//                   className={`p-2 my-4 rounded-md flex items-center ${
//                     userProfile?.payment &&
//                     userProfile?.payment.length > 0 &&
//                     userProfile.payment[0].paymentStatus === true
//                       ? "bg-green-50 text-green-700"
//                       : "bg-red-50 text-red-700"
//                   }`}
//                 >
//                   <FontAwesomeIcon
//                     icon={
//                       userProfile?.payment &&
//                       userProfile.payment[0].paymentStatus === true
//                         ? faCheckCircle
//                         : faTimesCircle
//                     }
//                     className={`mr-2 ${
//                       userProfile?.payment &&
//                       userProfile.payment[0].paymentStatus === true
//                         ? "text-green-500"
//                         : "text-red-500"
//                     }`}
//                   />
//                   {userProfile?.payment &&
//                   userProfile.payment.length > 0 &&
//                   userProfile.payment[0].paymentStatus === true
//                     ? t("ProfilePage.PaymentConfirmed")
//                     : t("ProfilePage.PaymentNotConfirmed")}
//                 </span>
//               </div>

//               <Link
//                 to="/payment"
//                 className="mt-4 inline-block bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
//               >
//                 <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
//                 {t("ProfilePage.Update")}
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//       {isEditProfileOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <EditProfile
//             onClose={closeEditProfile}
//             setProfileEdited={setProfileEdited}
//             user={userProfile?.user}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// const ProfileItem = ({ icon, label, value }) => (
//   <div className="flex items-center">
//     <FontAwesomeIcon icon={icon} className="text-gray-500 mr-3 w-5" />
//     <div>
//       <p className="font-semibold text-sm text-gray-600">{label}</p>
//       <p className="text-lg">{value || "-"}</p>
//     </div>
//   </div>
// );

// export default ProfilePage;

import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Footer from "../components/sections/Footer";
import Navbar from "../components/Navbar";
import EditProfile from "../components/EditProfile";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getSingleUser } from "../redux/api-calls/user";
import { checkTokenExpiry } from "../utils/checkTokenExpiry";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLanguage,
  faPhone,
  faCreditCard,
  faEdit,
  faReceipt,
  faCalendarCheck,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const token = Cookies.get("jwt");
  const decoded = token && jwtDecode(token);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileEdited, setProfileEdited] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  const openEditProfile = () => setIsEditProfileOpen(true);
  const closeEditProfile = () => {
    setIsEditProfileOpen(false);
    if (profileEdited) getUserProfile();
  };

  const getUserProfile = () => {
    getSingleUser(decoded.id, token)
      .then((res) => setUserProfile(res.data))
      .catch((err) => console.error("Error fetching user profile:", err));
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  if (!token || checkTokenExpiry(decoded.exp)) return <Navigate to="/signin" />;
  if (token && decoded?.role === "admin") return <Navigate to="/dashboard" />;

  // Default hardcoded data
  const defaultData = {
    subscription_type: t("ProfilePage.Free"),
    paymentStatus: false,
    subscriptionEnd: t("ProfilePage.ExamNumberBased"),
  };
const getTranslatedSubscriptionType = (type) => {
  const subscriptionMap = {
    "two-exams": "TwoExams",
    "five-exams": "FiveExams",
    "weekly": "Weekly",
    "two-weekly": "TwoWeekly",
    "monthly": "Monthly",
    "free": "Free",
    "one-time": "OneTime"
  };
  return subscriptionMap[type] || "UnknownSubscription";
};

 const paymentData =
  userProfile.payment && userProfile.payment.length > 0
    ? [...userProfile.payment].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
    : defaultData;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row mt-6 gap-8">
          <div className="flex-1 bg-white rounded-lg shadow-lg p-8 mb-6 md:mb-0 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-primary-800 border-b pb-2">
              {t("ProfilePage.MyAccount")}
            </h2>
            <div className="space-y-4">
              <ProfileItem
                icon={faUser}
                label={t("ProfilePage.Name")}
                value={userProfile?.user?.name}
              />
              <ProfileItem
                icon={faLanguage}
                label={t("ProfilePage.Language")}
                value={
                  userProfile?.user?.language === "en"
                    ? "English"
                    : userProfile?.user?.language === "fr"
                    ? "French"
                    : userProfile?.user?.language === "rw"
                    ? "Kinyarwanda"
                    : t("ProfilePage.languageNotProvided")
                }
              />
              <ProfileItem
                icon={faPhone}
                label={t("ProfilePage.Phone")}
                value={userProfile?.user?.phone}
              />
            </div>
            <button
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center"
              onClick={openEditProfile}
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              {t("ProfilePage.Edit")}
            </button>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-primary-800 border-b pb-2">
              {t("ProfilePage.AccountInformation")}
            </h2>

            <div className="mb-3 mt-3">
              <h3 className="mb-2 font-bold text-lg">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="mr-2 text-blue-600"
                />{" "}
                {t("ProfilePage.PaymentPeriod")}
              </h3>
              <p className="pl-8 my-3 rounded-md flex items-center">
                {t(`ProfilePage.${getTranslatedSubscriptionType(paymentData.subscription_type)}`)}
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-md">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="mr-2 text-blue-600"
                />{" "}
                {t("ProfilePage.PaymentPeriodEnd")}
              </h4>
              <span className="pl-8 my-3 rounded-md flex items-center">
                {paymentData.subscriptionEnd  &&
                !isNaN(new Date(paymentData.subscriptionEnd).getTime())
                  ? new Date(paymentData.subscriptionEnd).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric",
                        hour: "numeric", minute: "numeric"
                       }
                    )
                  : t("ProfilePage.ExamNumberBased")}
              </span>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-md">
                <FontAwesomeIcon
                  icon={faReceipt}
                  className="mr-2 text-blue-600"
                />
                {t("ProfilePage.PaymentStatus")}
              </h4>
              <span
                className={`p-2 my-4 rounded-md flex items-center ${
                  paymentData.paymentStatus
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    paymentData.paymentStatus ? faCheckCircle : faTimesCircle
                  }
                  className={`mr-2 ${
                    paymentData.paymentStatus
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                />
                {paymentData.paymentStatus
                  ? t("ProfilePage.PaymentConfirmed")
                  : t("ProfilePage.PaymentNotConfirmed")}
              </span>
            </div>

            <Link
              to="/payment"
              className="mt-4 inline-block bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
              {t("ProfilePage.Update")}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <EditProfile
            onClose={closeEditProfile}
            setProfileEdited={setProfileEdited}
            user={userProfile?.user}
          />
        </div>
      )}
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <FontAwesomeIcon icon={icon} className="text-gray-500 mr-3 w-5" />
    <div>
      <p className="font-semibold text-sm text-gray-600">{label}</p>
      <p className="text-lg">{value || "-"}</p>
    </div>
  </div>
);

export default ProfilePage;
