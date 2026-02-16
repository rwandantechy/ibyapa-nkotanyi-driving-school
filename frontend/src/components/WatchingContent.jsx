/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../redux/api-calls/videos";
import { Navigate } from "react-router";
import { Spinner, Alert } from "flowbite-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

const WatchingContent = () => {
  const { t } = useTranslation(); 
  const token = Cookies.get("jwt");
  const dispatch = useDispatch();

  const { videos: myVideos, loading, error } = useSelector((state) => state.videos);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) getAllVideos(token, dispatch);
  }, [token, dispatch]);

  if (!token) {
    return <Navigate to="/signin" />;
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-4">
          <Spinner size="lg" />
          <span className="text-lg font-medium text-gray-700">{t("WatchingContent.GettingVideos")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
        <Alert color="warning" rounded className="w-full max-w-md text-lg mb-4 shadow-md">
          <span className="font-medium">{error.response?.data ? t("WatchingContent.NoPaymentError") : error.message}</span>
        </Alert>
        <Link
          to="/payment"
          className="bg-primary-700 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg"
        >
          {t("WatchingContent.PayNow")}
        </Link>
      </div>
    );
  }

  const filteredVideos = myVideos?.data?.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-50 py-10 px-2 sm:px-4 lg:px-6">
      <input
        type="text"
        placeholder={t("WatchingContent.SearchVideoPlaceholder")} 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-lg mb-6 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-700 transition duration-200 shadow-md"
      />
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-lg border-2 border-gray-400  shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <iframe
                  src={video.video}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-48 sm:h-64 lg:h-72 rounded-t-lg"
                />
              </div>
              <div className="w-full text-primary-800 p-4 text-center">
                <h3 className="text-base font-semibold">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchingContent;
