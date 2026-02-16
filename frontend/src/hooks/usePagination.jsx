import { useState } from "react";

const usePagination = (data, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const nextPage = () =>
    setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages));

  const prevPage = () =>
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  return {
    nextPage,
    prevPage,
    currentItems,
    currentPage,
    totalPages,
  };
};

export default usePagination;
