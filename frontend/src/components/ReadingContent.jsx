/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Alert, Spinner } from "flowbite-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { CiRead } from "react-icons/ci";
import { FaFilePdf, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllPdfs } from "../redux/api-calls/pdfs";
import { useTranslation } from "react-i18next";

const ReadingContent = () => {
  const { t } = useTranslation();
  const token = Cookies.get("jwt");
  const { pdfs, loading, error } = useSelector((state) => state.pdfs);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) {
      getAllPdfs(token, dispatch);
    }
  }, [token, dispatch]);

  const filteredPdfs = pdfs.data?.filter((pdf) =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Spinner size="xl" className="mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">{t("ReadingContent.Loading")}</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <Alert
          color="warning"
          rounded
          className="mb-6 w-full max-w-md text-lg shadow-lg"
        >
          <span className="font-medium">
            {error.response?.data ? t("ReadingContent.NoPayment") : error.message}
          </span>
        </Alert>
        <Link
          to="/payment"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
        >
          {t("ReadingContent.PayNow")}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-gray-100 to-white ">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t("ReadingContent.YourDocuments")}</h1>
      <div className="relative max-w-lg mx-auto mb-8">
        <input
          type="text"
          placeholder={t("ReadingContent.SearchDocumentPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm transition duration-300 ease-in-out"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPdfs.map((pdf) => (
          <div
            key={pdf._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg cursor-pointer p-4 flex flex-col space-y-4"
            onClick={() => navigate("/pdf", { state: { pdfUrl: pdf.file } })}
          >
            <div className="flex items-center space-x-4">
              <FaFilePdf className="text-red-500 text-4xl" />
              <h3 className="text-lg font-semibold text-gray-800">{pdf.title}</h3>
            </div>
            <div className="self-end">
              <CiRead className="text-3xl text-primary-600" />
            </div>
          </div>
        ))}
      </div>
      {filteredPdfs.length === 0 && (
        <p className="text-center text-gray-500 mt-12 text-lg">{t("ReadingContent.NoDocumentsFound")}</p>
      )}
    </div>
  );
};

export default ReadingContent;
