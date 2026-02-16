import { useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import SideNav from "../components/Dashboard/SideNav";
import MainDashboardContent from "../components/Dashboard/MainDashboardContent";
import { checkTokenExpiry } from "../utils/checkTokenExpiry";

const DashboardPage = () => {
  const [selectedSidebar, setSelectedSidebar] = useState("dashboard");
  const token = Cookies.get("jwt");
  const decoded = token && jwtDecode(token);

  const handleSelectedSidebar = (sidebar) => {
    setSelectedSidebar(sidebar);
  };
  if (!token || decoded?.role !== "admin" || checkTokenExpiry(decoded.exp)) {
    Cookies.remove("jwt");
    return <Navigate to="/signin" />;
  }

  if (decoded?.role !== "admin" && !decoded?.permissions.length) {
    return <Navigate to="/user-dashboard" />;
  }

  return (
    <div className="bg-gray-100 flex">
      <SideNav
        selectedSidebar={selectedSidebar}
        onSideBarClick={handleSelectedSidebar}
      />
      <div className="w-full flex flex-col h-screen overflow-y-hidden">
        <DashboardHeader
          selectedSidebar={selectedSidebar}
          onSideBarClick={handleSelectedSidebar}
        />
        <MainDashboardContent selectedSidebar={selectedSidebar} />
      </div>
    </div>
  );
};

export default DashboardPage;
