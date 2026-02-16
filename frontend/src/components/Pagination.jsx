/* eslint-disable react/prop-types */
const Pagination = ({ currentPage, totalPages, nextPage, prevPage }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        className={`text-primary-900 font-bold hover:text-blue-900 ${
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        }`}
        onClick={prevPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={`text-blue-600 hover:text-blue-900 ${
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        }`}
        onClick={nextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
