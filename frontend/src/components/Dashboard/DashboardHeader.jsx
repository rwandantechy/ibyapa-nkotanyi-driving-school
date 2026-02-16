/* eslint-disable react/prop-types */
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { BiSolidVideos } from "react-icons/bi";
import { FaFilePdf, FaUsers, FaShieldAlt } from "react-icons/fa";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { MdAccountCircle, MdDashboard, MdPayments } from "react-icons/md";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { PiExamBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const DashboardHeader = ({ selectedSidebar, onSideBarClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const token = Cookies.get("jwt");
  const decoded = token && jwtDecode(token);

  const navRefs = useRef({});
  const navigate = useNavigate();

  const updateNavItemClass = (itemName) => {
    Object.values(navRefs.current).forEach((ref) => {
      ref.classList.remove("bg-blue-600", "text-white");
    });

    const selectedRef = navRefs.current[itemName];
    if (selectedRef) {
      selectedRef.classList.add("bg-blue-600", "text-white");
    }
  };

  const handleLogout = () => {
    Cookies.remove("jwt");
    navigate("/");
  };

  useEffect(() => {
    updateNavItemClass(selectedSidebar);
  }, [selectedSidebar]);

  const navItems = [
    { name: "dashboard", icon: MdDashboard, label: "Dashboard" },
    { name: "users", icon: FaUsers, label: "Users" },
    { name: "payments", icon: MdPayments, label: "Payments" },
    { name: "pdfs", icon: FaFilePdf, label: "PDF" },
    { name: "questions", icon: PiExamBold, label: "Questions" },
    { name: "videos", icon: BiSolidVideos, label: "Videos" },
    { name: "adminTools", icon: FaShieldAlt, label: "Admin Tools" },
    { name: "account", icon: MdAccountCircle, label: "Account" },
     { name: "resetPassword", icon: AiOutlineQuestionCircle, label: "Reset Password" }
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="w-full bg-white shadow-md py-4 px-6 hidden sm:flex items-center justify-between">
        <div className="flex items-center">
          <a href="https://ibyapa.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/logo.jpg"
              alt="Logo image"
              className="h-[40px] object-contain"
            />
          </a>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full py-2 px-4 focus:outline-none transition duration-150 ease-in-out"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {decoded?.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-gray-700">{decoded?.name}</span>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
              <div
                onClick={() => {
                  onSideBarClick("account");
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Account
              </div>
              <div
                onClick={() => handleLogout()}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Sign Out
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Header & Nav */}
      <header className="bg-white shadow-md py-4 px-6 sm:hidden">
        <div className="flex items-center justify-between">
          <a href="https://ibyapa.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/new-logo.svg"
              alt="Logo image"
              className="h-[40px] object-contain"
            />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            {!isOpen ? <IoMdMenu size={24} /> : <IoMdClose size={24} />}
          </button>
        </div>

        {/* Dropdown Nav */}
        <nav className={`mt-4 ${isOpen ? 'block' : 'hidden'}`}>
          {navItems.map((item) => (
            <div
              key={item.name}
              ref={(ref) => (navRefs.current[item.name] = ref)}
              onClick={() => {
                onSideBarClick(item.name);
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <item.icon className="mr-3" />
              {item.label}
            </div>
          ))}
          <button
            onClick={() => handleLogout()}
            className="w-full mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition duration-150 ease-in-out flex items-center justify-center"
          >
            <LiaSignOutAltSolid className="mr-2" /> Sign Out
          </button>
        </nav>
      </header>
    </>
  );
};

export default DashboardHeader;