/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(() => {
    const storedTab = localStorage.getItem("activeTab");
    return storedTab ? storedTab : children[0].props.label;
  });

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="mx-4 md:mx-0">
      {/* Responsive tab container */}
      <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 overflow-x-auto  border-gray-300 bg-white px-4 py-2 rounded-lg shadow-lg relative mb-4">
        {/* Active tab indicator */}
        <div
          className="absolute  transition-all duration-300 ease-in-out"
          style={{
            width: `${100 / children.length}%`,
            transform: `translateX(${children.findIndex(child => child.props.label === activeTab) * 100}%)`,
          }}
        />
        {children.map((child) => (
          <button
            key={child.props.label}
            className={`${
              activeTab === child.props.label
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            } flex-grow text-center py-2 px-4 rounded transition-all duration-200 transform hover:scale-105 shadow-sm whitespace-nowrap`}
            onClick={(e) => handleClick(e, child.props.label)}
          >
            {child.props.label}
          </button>
        ))}
      </div>

      {/* Content area with fade-in transition */}
      <div className="py-6 mx-4 md:mx-2 relative">
        {children.map((child) => (
          <div
            key={child.props.label}
            className={`${
              activeTab === child.props.label ? "opacity-100" : "opacity-0 absolute"
            } transition-opacity duration-300 ease-in-out w-full`}
          >
            {activeTab === child.props.label && child.props.children}
          </div>
        ))}
      </div>
    </div>
  );
};

const Tab = ({ label, children }) => {
  return (
    <div label={label} className="hidden">
      {children}
    </div>
  );
};

export { Tabs, Tab };
