import React from "react"
import { Link } from "react-router-dom"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageClick,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex justify-center order-1 sm:order-2 w-full sm:w-auto">
        <ul className="pagination flex">
          <li
            className={`page-item ${
              currentPage <= 1 ? "disabled opacity-50" : ""
            }`}
          >
            <Link className="page-link px-3 py-2" to="#" onClick={onPrevious}>
              <MdChevronLeft />
            </Link>
          </li>
          {[...Array(totalPages).keys()].map(page => (
            <li
              key={page + 1}
              className={`page-item hidden sm:block ${
                currentPage === page + 1 ? "active" : ""
              }`}
            >
              <Link
                className="page-link px-3 py-2"
                to="#"
                onClick={() => onPageClick(page + 1)}
              >
                {page + 1}
              </Link>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage >= totalPages ? "disabled opacity-50" : ""
            }`}
          >
            <Link className="page-link px-3 py-2" to="#" onClick={onNext}>
              <MdChevronRight />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PaginationControls
