import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import ExamsContent from "../components/ExamsContent";
import Footer from "../components/sections/Footer";
import Navbar from "../components/Navbar";
import ReadingContent from "../components/ReadingContent";
import { Tabs, Tab } from "../components/Tabs";
import WatchingContent from "../components/WatchingContent";
import PerformanceContent from "../components/PerformanceContent";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { checkTokenExpiry } from "../utils/checkTokenExpiry";
import { useTranslation } from "react-i18next";

const UserDashaboard = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidUser, setIsValidUser] = useState(false);

  useEffect(() => {
    const validateUser = () => {
      try {
        const token = Cookies.get("jwt");
        
        if (!token) {
          setIsValidUser(false);
          setIsLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        
        if (decoded?.role !== "user" || checkTokenExpiry(decoded.exp)) {
          Cookies.remove("jwt");
          setIsValidUser(false);
        } else {
          setIsValidUser(true);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        Cookies.remove("jwt");
        setIsValidUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateUser();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar hideLanguageSwitcher={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect if not valid user
  if (!isValidUser) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="flex flex-col space-y-4  min-h-screen w-screen justify-between">
      <Navbar hideLanguageSwitcher={false} />
      <div className="container mx-auto justify-self-start h-full">
        <div className="max-w-screen-xl mx-auto">
          <Tabs>
            <Tab label={t("Dashboard.Exams")}>
              <ExamsContent />
            </Tab>
            <Tab label={t("Dashboard.Reading")}>
              <ReadingContent />
            </Tab>
            <Tab label={t("Dashboard.Watching")}>
              <WatchingContent />
            </Tab>
            {/* Performance Tab */}
            <Tab label={t("Dashboard.Performance")}>
              <PerformanceContent />
             
            </Tab>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashaboard;
