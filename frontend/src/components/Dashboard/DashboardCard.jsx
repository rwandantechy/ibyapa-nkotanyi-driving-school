/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
// make the text responsive

const DashboardCard = ({ dataLength, Icon, TopLabel, lowLabel, userStats }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("default", {
    month: "short",
    year: "numeric",
    day: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
    className="w-full min-h-[200px]"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
  >
    <div className="relative py-5 px-6 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-white/20 backdrop-blur-sm">
      
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col text-white flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold truncate">
            Total {TopLabel}
          </h3>
          <p className="text-white/70 italic text-xs sm:text-sm mt-1">
            Until {formattedDate} at {formattedTime}
          </p>
        </div>
        <div className="bg-white p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 shadow-sm">
          <Icon size={22} className="text-blue-600 sm:w-6 sm:h-6" />
        </div>
      </div>
  
      {/* Divider (optional for separation) */}
      <div className="w-full h-[1px] bg-white/20 my-4"></div>
  
      {/* Metric section */}
      <div className="flex flex-col items-center justify-center mt-2">
        <h2
          className="font-extrabold text-white leading-tight
                     text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {dataLength.toLocaleString()}
        </h2>
        <p className="text-white/85 text-sm sm:text-base mt-1 font-medium">
          {lowLabel}
        </p>
        {/* User stats bar (only for Users card) */}
        {userStats && TopLabel === "Users" && (
          <div className="grid grid-cols-3 gap-2 mt-6 w-full">
            {/* Today */}
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-extrabold text-white">{userStats.today}</span>
              <span className="text-xs sm:text-sm text-white/70 mt-1">Just Today </span>
            </div>
            {/* Month */}
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-extrabold text-white">{userStats.month}</span>
              <span className="text-xs sm:text-sm text-white/70 mt-1"> This Month:  <span>{new Date().toLocaleString("default", { month: "short" })}</span>
              </span>
            </div>
            {/* Year */}
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-extrabold text-white">{userStats.year}</span>
              <span className="text-xs sm:text-sm text-white/70 mt-1"> This Year: <span>
                {new Date().getFullYear()}
                </span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  </motion.div>
  
  
  );
};

export default DashboardCard;
