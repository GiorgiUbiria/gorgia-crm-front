import React, { useEffect, useState } from "react"
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Input,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getVacations } from "services/admin/vacation"
import { updateVacationStatus } from "services/vacation"
import "./VacationPageApprove.scss"

const VacationPageApprove = ({ filterStatus }) => {
  document.title = "შვებულების ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([])
  const [vacations, setVacations] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionModal, setRejectionModal] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Function to toggle row expansion
  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  // Function to fetch vacation data
  const fetchVacations = async () => {
    try {
      const response = await getVacations()
      console.log("Fetched vacations:", response.data.vocations.length)
      setVacations(response.data.vocations)
    } catch (err) {
      console.error("Error fetching vacation requests:", err)
    }
  }

  useEffect(() => {
    fetchVacations()
  }, [])

  const handleUpdateStatus = async (vacationId, status) => {
    try {
      if (status === "rejected") {
        setSelectedVacation(vacationId);
        setRejectionModal(true);
        return;
      }

      await updateVacationStatus(vacationId, status);
      setVacations(prevVacations =>
        prevVacations.map(vacation =>
          vacation.id === vacationId ? { ...vacation, status } : vacation
        )
      );
    } catch (err) {
      console.error("Error updating vacation status:", err);
    }
  };

  const handleRejectionSubmit = async () => {
    try {
      await updateVacationStatus(selectedVacation, "rejected", rejectionComment);
      setVacations(prevVacations =>
        prevVacations.map(vacation =>
          vacation.id === selectedVacation ?
            { ...vacation, status: "rejected", rejection_comment: rejectionComment } :
            vacation
        )
      );
      setRejectionModal(false);
      setRejectionComment("");
      setSelectedVacation(null);
    } catch (err) {
      console.error("Error rejecting vacation:", err);
    }
  };

  const filteredVacations = vacations
    .filter(vacation => 
      vacation.user && vacation.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(vacation =>
      filterStatus ? filterStatus.includes(vacation.status) : true
    );

  console.log("Vacations in state:", vacations.length)

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredVacations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredVacations.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Replace the existing table with this modern version
  const renderTable = () => (
    <div className="vacation-table-modern">
      <div className="table-container">
        <Table hover className="align-middle table-modern mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>მომთხოვნი პირი</th>
              <th>დაწყების თარიღი</th>
              <th>დასრულების თარიღი</th>
              <th>სტატუსი</th>
              <th>ვიზირება</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((vacation, index) => (
              <React.Fragment key={vacation.id}>
                <tr
                  className={`vacation-row ${
                    vacation.status === "rejected"
                      ? "status-rejected"
                      : vacation.status === "approved"
                      ? "status-approved"
                      : "status-pending"
                  }`}
                  onClick={() => toggleRow(indexOfFirstItem + index)}
                >
                  <td className="index-column">{indexOfFirstItem + index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-wrapper">
                        <span className="avatar-initial">
                          {vacation.user?.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <span className="user-name">{vacation.user?.name}</span>
                    </div>
                  </td>
                  <td className="date-column">
                    <div className="date-wrapper">
                      <i className="bx bx-calendar me-2"></i>
                      {new Date(vacation.start_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="date-column">
                    <div className="date-wrapper">
                      <i className="bx bx-calendar-check me-2"></i>
                      {new Date(vacation.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${vacation.status}`}>
                      <i className={`bx ${
                        vacation.status === "rejected"
                          ? "bx-x-circle"
                          : vacation.status === "approved"
                          ? "bx-check-circle"
                          : "bx-time"
                      } me-1`}></i>
                      {vacation.status}
                    </span>
                  </td>
                  <td>
                    {vacation.status === "rejected" ? (
                      <Button color="none" className="btn-action btn-rejected" disabled>
                        <i className="bx bx-block me-1"></i>
                        უარყოფილია
                      </Button>
                    ) : vacation.status === "approved" ? (
                      <Button color="none" className="btn-action btn-approved" disabled>
                        <i className="bx bx-check-double me-1"></i>
                        დადასტურებულია
                      </Button>
                    ) : (
                      <div className="action-buttons">
                        <Button
                          color="none"
                          className="btn-action btn-approve"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(vacation.id, "approved");
                          }}
                        >
                          <i className="bx bx-check-double me-1"></i>
                          დადასტურება
                        </Button>
                        <Button
                          color="none"
                          className="btn-action btn-reject"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(vacation.id, "rejected");
                          }}
                        >
                          <i className="bx bx-block me-1"></i>
                          უარყოფა
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
                {expandedRows.includes(indexOfFirstItem + index) && (
                  <tr>
                    <td colSpan="6">
                      <div className="p-3">
                        <h5 className="mb-3">დეტალური ინფორმაცია</h5>
                        <Row>
                          <Col md={6}>
                            <ul className="list-unstyled">
                              <li className="mb-2">
                                <strong>თანამშრომელი:</strong>
                                <ul>
                                  <li>სახელი: {vacation.user.name}</li>
                                  <li>პოზიცია: {vacation.user.position}</li>
                                  <li>ID: {vacation.user.id}</li>
                                  <li>მისამართი: {vacation.user.location}</li>
                                </ul>
                              </li>
                              <li className="mb-2">
                                <strong>შვებულების ტიპი:</strong>{' '}
                                {vacation.type_of_vocations === 'paid' ? 'ანაზღაურებადი' :
                                  vacation.type_of_vocations === 'unpaid' ? 'ანაზღაურების გარეშე' :
                                    vacation.type_of_vocations === 'maternity' ? 'დეკრეტული' :
                                      vacation.type_of_vocations === 'administrative' ? 'ადმინისტრაციული' : 'არ არის მითითებული'}
                              </li>
                            </ul>
                          </Col>
                          <Col md={6}>
                            <ul className="list-unstyled">
                              <li className="mb-2">
                                <strong>პერიოდი:</strong>
                                <ul>
                                  <li>დაწყება: {new Date(vacation.start_date).toLocaleDateString()}</li>
                                  <li>დასრულება: {new Date(vacation.end_date).toLocaleDateString()}</li>
                                  <li>სულ დღეები: {vacation.duration}</li>
                                </ul>
                              </li>
                              <li className="mb-2">
                                <strong>დასვენების დღეები:</strong>
                                <ul>
                                  {vacation.monday === 'yes' && <li>ორშაბათი</li>}
                                  {vacation.tuesday === 'yes' && <li>სამშაბათი</li>}
                                  {vacation.wednesday === 'yes' && <li>ოთხშაბათი</li>}
                                  {vacation.thursday === 'yes' && <li>ხუთშაბათი</li>}
                                  {vacation.friday === 'yes' && <li>პარასკევი</li>}
                                  {vacation.saturday === 'yes' && <li>შაბათი</li>}
                                  {vacation.sunday === 'yes' && <li>კვირა</li>}
                                </ul>
                              </li>
                            </ul>
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

      <div className="table-footer">
        <div className="items-per-page">
          <select
            className="form-select form-select-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10 rows</option>
            <option value="20">20 rows</option>
            <option value="50">50 rows</option>
            <option value="100">100 rows</option>
          </select>
          <span className="items-info">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredVacations.length)} of{" "}
            {filteredVacations.length} entries
          </span>
        </div>

        <Pagination className="modern-pagination">
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink previous onClick={() => paginate(currentPage - 1)}>
              <i className="bx bx-chevron-left"></i>
            </PaginationLink>
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem active={currentPage === i + 1} key={i}>
              <PaginationLink onClick={() => paginate(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink next onClick={() => paginate(currentPage + 1)}>
              <i className="bx bx-chevron-right"></i>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    </div>
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="შვებულებები" breadcrumbItem="ვიზირება" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <Input
                type="search"
                placeholder="ძებნა თანამშრომლის მიხედვით..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bsSize="sm"
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">შვებულების ვიზირების გვერდი</CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ქვემოთ მოცემულია შვებულების მოთხოვნები
                  </CardSubtitle>
                  {renderTable()}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Modal isOpen={rejectionModal} toggle={() => setRejectionModal(false)}>
        <ModalHeader toggle={() => setRejectionModal(false)}>
          უარყოფის მიზეზი
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="rejectionComment">გთხოვთ მიუთითოთ უარყოფის მიზეზი</Label>
              <Input
                type="textarea"
                name="rejectionComment"
                id="rejectionComment"
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                rows="4"
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={handleRejectionSubmit}
            disabled={!rejectionComment.trim()}
          >
            უარყოფა
          </Button>
          <Button color="secondary" onClick={() => setRejectionModal(false)}>
            გაუქმება
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default VacationPageApprove
