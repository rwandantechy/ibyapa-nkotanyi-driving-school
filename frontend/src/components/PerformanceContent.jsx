/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from "react";
import { Alert, Table, Button, Spinner } from "flowbite-react";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAllPerformances } from "../redux/api-calls/performance";
import { format } from "date-fns";

const PerformanceContent = () => {
  const { t } = useTranslation();
  const token = Cookies.get("jwt");
  const { performances, loading, error } = useSelector((state) => state.performance);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    if (token) {
      getAllPerformances(token, dispatch);
    }
  }, [token, dispatch]);

  const { currentRecords, totalPages } = useMemo(() => {
    const lastRecordIndex = currentPage * recordsPerPage;
    const firstRecordIndex = lastRecordIndex - recordsPerPage;
    const currentRecords = performances?.slice(firstRecordIndex, lastRecordIndex) || [];
    const totalPages = Math.ceil((performances?.length || 0) / recordsPerPage);
    return { currentRecords, totalPages };
  }, [performances, currentPage]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner size="xl" className="text-blue-600" />
        <h3 className="text-lg font-semibold mt-4 text-gray-700">{t("PerformanceContent.Loading")}</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col container items-center justify-center min-h-screen px-4">
        <Alert
          color="failure"
          className="w-full max-w-md shadow-lg rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-2">{t("PerformanceContent.Error")}</h3>
          <p>{t("PerformanceContent.LoadError")}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl text-center sm:text-3xl font-bold text-gray-800 mb-6">
        {t("PerformanceContent.ExamHistory")}
      </h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["#", "DateTaken", "ExamName", "Marks"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(`PerformanceContent.${header}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.length > 0 ? (
                currentRecords.map((exam, index) => (
                  <tr key={exam._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(exam.createdAt), "dd/MM/yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.examName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {exam.marks}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    {t("PerformanceContent.NoRecords")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        t={t}
      />
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange, t }) => {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          {t("PerformanceContent.Showing")} <span className="font-medium">{currentPage}</span> {t("PerformanceContent.Of")}{" "}
          <span className="font-medium">{totalPages}</span> {t("PerformanceContent.Pages")}
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <Button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          {t("PerformanceContent.Previous")}
        </Button>
        <Button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          {t("PerformanceContent.Next")}
        </Button>
      </div>
    </nav>
  );
};

export default PerformanceContent;