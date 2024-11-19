import { Link } from "react-router-dom";
import React from "react";
import { Col, Row } from "reactstrap";

const Paginations = ({
    perPageData,
    totalItems,
    currentPage,
    setCurrentPage,
    onPreviousPage,
    onNextPage,
    isShowingPageLength,
    paginationDiv,
    paginationClass
}) => {
    if (!totalItems || !perPageData || perPageData <= 0 || totalItems <= 0) {
        return null; // or return a fallback UI if appropriate
    }

    const totalPages = Math.max(1, Math.ceil(totalItems / perPageData));

    console.log('Total Items:', totalItems);
    console.log('Items Per Page:', perPageData);
    console.log('Total Pages:', totalPages);
    console.log('Current Page:', currentPage);

    const handleClick = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPreviousPage();
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onNextPage();
        }
    };

    return (
        <React.Fragment>
            <Row className="justify-content-between align-items-center">
                {isShowingPageLength && (
                    <Col sm={12} md={5}>
                        <div className="text-muted dataTables_info">
                            Showing {perPageData} of {totalItems} entries
                        </div>
                    </Col>
                )}
                <div className={paginationDiv}>
                    <ul className={paginationClass}>
                        <li className={`page-item ${currentPage <= 1 ? "disabled" : ''}`}>
                            <Link className="page-link" to="#" onClick={handlePreviousPage}>
                                <i className="mdi mdi-chevron-left"></i>
                            </Link>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li
                                key={index + 1}
                                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                            >
                                <Link
                                    className="page-link"
                                    to="#"
                                    onClick={() => handleClick(index + 1)}
                                >
                                    {index + 1}
                                </Link>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage >= totalPages ? "disabled" : ''}`}>
                            <Link className="page-link" to="#" onClick={handleNextPage}>
                                <i className="mdi mdi-chevron-right"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Row>
        </React.Fragment>
    );
};

export default Paginations;
