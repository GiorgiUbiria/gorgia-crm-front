import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getPurchaseList } from "services/purchase";
import "./UserProcurements.scss";

const UserProcurement = () => {
  document.title = "შესყიდვები | Gorgia LLC";

  const [procurements, setProcurements] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  const fetchProcurements = async () => {
    try {
      const response = await getPurchaseList();
      setProcurements(response.data.internal_purchases);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  useEffect(() => {
    fetchProcurements();
  }, []);

  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const filteredProcurements = procurements.filter((procurement) =>
    `${procurement.user.name} ${procurement.user.sur_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProcurements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProcurements.length / itemsPerPage);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="შესყიდვები" breadcrumbItem="ჩემი შესყიდვები" />
            </Col>
          </Row>

          <Card className="procurement-history-card">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <CardTitle className="h4 mb-1">შესყიდვების ისტორია</CardTitle>
                  <CardSubtitle className="text-muted">
                    თქვენი შესყიდვების სრული ისტორია
                  </CardSubtitle>
                </div>
                <div className="search-box">
                  <Input
                    type="text"
                    className="form-control modern-search"
                    placeholder="ძებნა თანამშრომლის მიხედვით..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </div>

              <div className="procurement-table-modern">
                <div className="table-responsive">
                  <Table className="table-modern mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>თანამშრომელი</th>
                        <th>დეპარტამენტი</th>
                        <th>შესყიდვის ტიპი</th>
                        <th>თარიღი</th>
                        <th>მომწოდებელი</th>
                        <th>სტატუსი</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((procurement, index) => (
                        <React.Fragment key={procurement.id}>
                          <tr
                            onClick={() => toggleRow(index)}
                            className={`procurement-row status-${procurement.status}`}
                          >
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-wrapper">
                                  <span className="avatar-initial">
                                    {procurement.user?.name?.charAt(0) || "?"}
                                  </span>
                                </div>
                                <span className="user-name">
                                  {procurement.user.name} {procurement.user.sur_name}
                                </span>
                              </div>
                            </td>
                            <td>{procurement.department_id}</td>
                            <td>{procurement.type}</td>
                            <td>
                              <div className="date-wrapper">
                                <i className="bx bx-calendar me-2"></i>
                                {procurement.created_at}
                              </div>
                            </td>
                            <td>{procurement.supplier}</td>
                            <td>
                              <span className={`status-badge status-${procurement.status}`}>
                                <i className={`bx ${procurement.status === "rejected"
                                    ? "bx-x-circle"
                                    : procurement.status === "approved"
                                      ? "bx-check-circle"
                                      : "bx-time"
                                  } me-2`}></i>
                                {procurement.status === "rejected"
                                  ? "უარყოფილია"
                                  : procurement.status === "approved"
                                    ? "დადასტურებულია"
                                    : "მოლოდინში"}
                              </span>
                            </td>
                          </tr>
                          {expandedRows.includes(index) && (
                            <tr>
                              <td colSpan="7">
                                <div className="expanded-content">
                                  <Row>
                                    <Col md={6}>
                                      <div className="info-section">
                                        <h6 className="info-title">
                                          <i className="bx bx-user"></i>
                                          თანამშრომლის ინფორმაცია
                                        </h6>
                                        <ul className="info-list">
                                          <li>სახელი: {procurement.user.name}</li>
                                          <li>გვარი: {procurement.user.sur_name}</li>
                                          <li>პოზიცია: {procurement.user.position}</li>
                                          <li>დეპარტამენტი: {procurement.department_id}</li>
                                        </ul>
                                      </div>
                                    </Col>
                                    <Col md={6}>
                                      <div className="info-section">
                                        <h6 className="info-title">
                                          <i className="bx bx-package"></i>
                                          შესყიდვის დეტალები
                                        </h6>
                                        <ul className="info-list">
                                          <li>რაოდენობა: {procurement.quantity}</li>
                                          <li>ერთეულის ფასი: {procurement.unit_price}₾</li>
                                          <li>ჯამური ღირებულება: {procurement.total_price}₾</li>
                                          <li>აღწერა: {procurement.description}</li>
                                        </ul>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <Pagination>
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => paginate(currentPage - 1)} href="#" />
                  </PaginationItem>
                  {totalPages <= 5 ? (
                    [...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index + 1} active={currentPage === index + 1}>
                        <PaginationLink onClick={() => paginate(index + 1)} href="#">
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))
                  ) : (
                    <>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber} active={currentPage === pageNumber}>
                              <PaginationLink onClick={() => paginate(pageNumber)} href="#">
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink disabled href="#">
                                ...
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                    </>
                  )}
                  <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink next onClick={() => paginate(currentPage + 1)} href="#" />
                  </PaginationItem>
                </Pagination>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserProcurement; 