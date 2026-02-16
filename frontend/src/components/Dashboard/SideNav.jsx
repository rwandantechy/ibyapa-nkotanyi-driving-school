import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaFilePdf, FaShieldAlt } from "react-icons/fa";
import { MdPayments, MdDashboard } from "react-icons/md";
import { BiSolidVideos } from "react-icons/bi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { PiExamBold } from "react-icons/pi";

/* eslint-disable react/prop-types */
const SideNav = ({ selectedSidebar, onSideBarClick }) => {
  const navRefs = useRef({});

  const updateNavItemClass = (itemName) => {
    Object.values(navRefs.current).forEach((ref) => {
      ref.classList.remove("bg-[#1947ee]");
    });

    const selectedRef = navRefs.current[itemName];
    if (selectedRef) {
      selectedRef.classList.add("bg-[#1947ee]");
    }
  };

  useEffect(() => {
    updateNavItemClass(selectedSidebar);
  }, [selectedSidebar]);

  return (
    <aside className="relative bg-gray-700 h-screen w-64 hidden sm:block shadow-xl">
      <div className="p-6">
        <Link
          to="/dashboard"
          className="text-white text-3xl font-semibold uppercase hover:text-gray-300"
        >
          Admin
        </Link>
      </div>
      <nav className="text-white text-base font-semibold pt-3">
        <div
          ref={(ref) => (navRefs.current["dashboard"] = ref)}
          className={`flex items-center text-white py-4 pl-6 nav-item cursor-pointer`}
          onClick={() => onSideBarClick("dashboard")}
        >
          <MdDashboard className="mr-3" />
          Dashboard
        </div>
        <div
          ref={(ref) => (navRefs.current["users"] = ref)}
          className={`flex items-center  text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-itemb cursor-pointer`}
          onClick={() => onSideBarClick("users")}
        >
          <FaUsers className=" mr-3" />
          <span>Users</span>
        </div>
        <div
          ref={(ref) => (navRefs.current["payments"] = ref)}
          className={`flex items-center   text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item cursor-pointer`}
          onClick={() => onSideBarClick("payments")}
        >
          <MdPayments className="mr-3" />
          <span>Payments</span>
        </div>
        <div
          ref={(ref) => (navRefs.current["pdfs"] = ref)}
          className={`flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item cursor-pointer `}
          onClick={() => onSideBarClick("pdfs")}
        >
          <FaFilePdf className="mr-3" />
          <span>PDF</span>
        </div>
        <div
          ref={(ref) => (navRefs.current["questions"] = ref)}
          className={`flex items-center  text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item cursor-pointer `}
          onClick={() => onSideBarClick("questions")}
        >
          <PiExamBold className="mr-3" />
          Questions
        </div>
        <div
          ref={(ref) => (navRefs.current["videos"] = ref)}
          className={`flex items-center   text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item cursor-pointer `}
          onClick={() => onSideBarClick("videos")}
        >
          <BiSolidVideos className="mr-3" />
          Videos
        </div>
        <div
          ref={(ref) => (navRefs.current["adminTools"] = ref)}
          className={`flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item cursor-pointer`}
          onClick={() => onSideBarClick("adminTools")}
        >
          <FaShieldAlt className="mr-3" />
          Admin Tools
        </div>
        <div
          ref={(ref) => (navRefs.current["resetPassword"] = ref)}
          className={`flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item cursor-pointer`}
          onClick={() => onSideBarClick("resetPassword")}
        >
          <AiOutlineQuestionCircle className="mr-3" />
          Reset Password
        </div>
      </nav>
    </aside>
  );
};

export default SideNav;
