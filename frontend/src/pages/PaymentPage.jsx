/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/sections/Footer";
import Cookies from "js-cookie";
import { pay, checkPaymentStatus } from "../redux/api-calls/payment";
import { useTranslation, Trans } from "react-i18next";
import { Toaster, toast } from "react-hot-toast";

const PaymentPage = () => {
  const { t } = useTranslation();
  const token = Cookies.get("jwt");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.payment);

  const tabIcons = {
    momo: (
      <img
        src="/images/mtn-logo.jpeg"
        alt="MTN Logo"
        className="w-24 h-16 transition-transform duration-200 ease-in-out transform hover:scale-105"
      />
    ),
    airtel: (
      <img
        src="/images/airtel.jpeg"
        alt="Airtel Logo"
        className="w-24 h-16 transition-transform duration-200 ease-in-out transform hover:scale-105"
      />
    ),
    card: (
      <img
        src="/images/cards.jpeg"
        alt="Debit/Credit Card"
        className="w-24 h-16 transition-transform duration-200 ease-in-out transform hover:scale-105"
      />
    ),
  };

  const [activeTab, setActiveTab] = useState("momo");
  const [selectedPlan, setSelectedPlan] = useState("weekly");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    cardNumber: "",
    cardName: "",
    expDate: "",
    ccvNumber: "",
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);
  const lang = Cookies.get("lang") || "rw";

  const handleTabChange = (tab) => setActiveTab(tab);
  const handlePlanChange = (plan) => setSelectedPlan(plan);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const phoneRegex = /^(078|079|072|073)\d{7}$/;
    if (activeTab !== "card" && !phoneRegex.test(formData.phoneNumber)) {
      toast.error(t("PaymentPage.InvalidPhoneNumber"));
      return false;
    }
    if (activeTab === "card") {
      if (formData.cardNumber.length < 16) {
        toast.error(t("PaymentPage.InvalidCardNumber"));
        return false;
      }
      if (!formData.expDate || new Date(formData.expDate) < new Date()) {
        toast.error(t("PaymentPage.InvalidExpDate"));
        return false;
      }
      if (formData.ccvNumber.length < 3) {
        toast.error(t("PaymentPage.InvalidCCV"));
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    if (!validateForm()) return;
    
    // Check for valid token only when trying to pay
    if (!token) {
      toast.error("Please sign in to make a payment");
      navigate("/signin");
      return;
    }

    const newFormData = {
      amount: getPaymentAmount(),
      phone: formData.phoneNumber,
      subscription_type: selectedPlan,
      card_number: formData.cardNumber,
      card_name: formData.cardName,
      card_cvc: formData.ccvNumber,
      card_expdate: formData.expDate,
      lang: lang,
      payment_method: activeTab,
    };

    try {
      console.log("Payment token:", token ? "Token exists" : "No token");
      setIsProcessing(true);
      toast.loading(t("PaymentPage.ProcessingPayment"), {
        style: {
          padding: "15px",
          float: "right",
          margin: "15px",
          backgroundColor: "#48BB78",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
        },
      });

      const response = await pay(token, newFormData, activeTab, dispatch);
      toast.dismiss();

      if (response && response.data && response.data.link) {
        setMessage(t("PaymentPage.PaymentLinkOpened"));
        setMessageType('success');
        window.open(response.data.link, '_blank');
        // Auto-hide message after 30 seconds
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 30000);
      } else {
        setMessage(t("PaymentPage.PaymentSuccessful"));
        setMessageType('success');
        setTimeout(async () => {
          // Fire verification poll when message disappears (after 20 seconds)
          try {
            // Check if we have a reqRef from the response (for MoMo payments)
            if (response && response.data && response.data.reqRef) {
              console.log("Verifying payment status for reqRef:", response.data.reqRef);
              const statusResponse = await checkPaymentStatus(token, response.data.reqRef, dispatch);
              
              if (statusResponse && statusResponse.data && statusResponse.data.status === "SUCCESSFUL") {
                console.log("Payment verified as successful, database updated");
              } else {
                console.log("Payment still pending or failed");
              }
            }
          } catch (error) {
            console.log("Payment verification failed:", error.message);
            // Don't show error to user, just log it
          }
          
          // Navigate to dashboard after verification
          navigate("/user-dashboard");
        }, 20000); // 20 seconds
      }
    } catch (error) {
      toast.dismiss();
      setIsProcessing(false);
      setMessage(t("PaymentPage.PaymentFailed"));
      setMessageType('error');
      toast.error(t("PaymentPage.PaymentFailed"), {
        style: {
          padding: "15px",
          backgroundColor: "#F56565",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
        },
      });
    }
  };

  const getPaymentAmount = () => {
    const pricing = {
      rw: {
        "two-exams": 300,
        "five-exams": 500,
        weekly: 5000,
        "two-weekly": 8000,
        monthly: 10000,
      },
      en_fr: {
        "five-exams": 1000,
        weekly: 6000,
        "two-weekly": 10000,
        monthly: 15000,
      },
    };
    return lang === "rw"
      ? pricing.rw[selectedPlan] || 0
      : pricing.en_fr[selectedPlan] || 0;
  };

  // Removed problematic useEffect that was causing blinking/redirecting


  // Allow access to payment page even without token, but require token for payment
  // if (!token) {
  //   return <Navigate to="/signin" />;
  // }

  const paymentAmount = getPaymentAmount();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {Object.keys(tabIcons).map((tab) => (
            <button
              key={tab}
              className={`focus:outline-none transition-all duration-300 ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } rounded-lg py-4 px-6 flex items-center justify-center`}
              onClick={() => handleTabChange(tab)}
            >
              {tabIcons[tab]}
            </button>
          ))}
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold mb-6">
            {t("PaymentPage.SelectPlan")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(lang === "rw"
              ? ["two-exams", "five-exams", "weekly", "two-weekly", "monthly"]
              : ["five-exams", "weekly", "two-weekly", "monthly"]
            ).map((plan) => (
              <label
                key={plan}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan}
                  checked={selectedPlan === plan}
                  onChange={() => handlePlanChange(plan)}
                  className="hidden"
                />
                <span className="ml-2 text-lg">
                  <Trans
                    i18nKey={`PaymentPage.${
                      plan.charAt(0).toUpperCase() +
                      plan.slice(1).replace(/-/g, "")
                    }`}
                    components={{
                      strong: <strong className="font-semibold" />,
                    }}
                  />
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Prominent Message Display */}
        {message && (
          <div className={`mb-6 p-6 rounded-lg border-2 text-center text-lg font-semibold ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : messageType === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              {messageType === 'success' && (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {messageType === 'error' && (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-lg rounded-lg"
        >
          {activeTab !== "card" ? (
            <div className="mb-6">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                {t("PaymentPage.PhoneNumber")}
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("PaymentPage.PhonePlaceholder")}
              />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  {t("PaymentPage.CardNumber")}
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("PaymentPage.CardPlaceholder")}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  {t("PaymentPage.CardName")}
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("PaymentPage.CardNamePlaceholder")}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  {t("PaymentPage.PhoneNumber")}
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("PaymentPage.PhonePlaceholder")}
                />
                {message && (
                  <span className="text-red-500 text-sm mt-2 block">
                    {message}
                  </span>
                )}
              </div>
              <div className="flex mb-6 gap-4">
                <div className="w-1/2">
                  <label
                    htmlFor="expDate"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    {t("PaymentPage.ExpDate")}
                  </label>
                  <input
                    type="month"
                    id="expDate"
                    name="expDate"
                    value={formData.expDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="ccvNumber"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    {t("PaymentPage.CCV")}
                  </label>
                  <input
                    type="text"
                    id="ccvNumber"
                    name="ccvNumber"
                    value={formData.ccvNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("PaymentPage.CCVPlaceholder")}
                  />
                </div>
              </div>
            </>
          )}
          <div className="mb-6 bg-gray-100 p-4 rounded-lg">
            <span className="block text-xl font-bold text-gray-800">
              {t("PaymentPage.TotalAmount")}: {paymentAmount} RWF
            </span>
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold transition-all duration-300 ${
              loading || isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading || isProcessing}
          >
            {loading || isProcessing ? t("PaymentPage.Loading") : t("PaymentPage.PayNow")}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;