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
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getVacations } from "services/admin/vacation" // Updated import for updateVacationStatus
import { updateVacationStatus } from "services/vacation"

const VacationPageApprove = ({ filterStatus }) => {
  document.title = "შვებულების ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([]) // State to track expanded rows
  const [vacations, setVacations] = useState([]) // State to store vacation requests
  const [searchTerm, setSearchTerm] = useState("");

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
      setVacations(response.data.vocations)
    } catch (err) {
      console.error("Error fetching vacation requests:", err)
    }
  }

  useEffect(() => {
    fetchVacations()
  }, [])

  // Function to update vacation status (approve/reject)
  const handleUpdateStatus = async (vacationId, status) => {
    try {
      // Update vacation status on the backend
      await updateVacationStatus(vacationId, status)

      // Update the vacation status in the frontend
      setVacations(prevVacations =>
        prevVacations.map(vacation =>
          vacation.id === vacationId ? { ...vacation, status } : vacation
        )
      )
    } catch (err) {
      console.error("Error updating vacation status:", err)
    }
  }

  const filteredVacations = vacations
    .filter(vacation => 
      vacation.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(vacation => 
      filterStatus ? filterStatus.includes(vacation.status) : true
    );

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

                  <div className="table-responsive">
                    <Table className="table mb-0">
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
                        {filteredVacations.map((vacation, index) => (
                          <React.Fragment key={vacation.id}>
                            <tr
                              className={
                                vacation.status === "rejected"
                                  ? "table-danger"
                                  : vacation.status === "approved"
                                  ? "table-success"
                                  : "table-warning"
                              }
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{vacation.user.name}</td>
                              <td>
                                {new Date(vacation.start_date).toLocaleDateString()}
                              </td>
                              <td>
                                {new Date(vacation.end_date).toLocaleDateString()}
                              </td>
                              <td>{vacation.status}</td>
                              <td>
                                {vacation.status === "rejected" ? (
                                  <Button color="danger" disabled>
                                    <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                    უარყოფილია
                                  </Button>
                                ) : vacation.status === "approved" ? (
                                  <Button color="success" disabled>
                                    <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                    დადასტურებულია
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      type="button"
                                      color="success"
                                      style={{ marginRight: "10px" }}
                                      onClick={() =>
                                        handleUpdateStatus(vacation.id, "approved")
                                      }
                                    >
                                      <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                      დადასტურება
                                    </Button>
                                    <Button
                                      type="button"
                                      color="danger"
                                      onClick={() =>
                                        handleUpdateStatus(vacation.id, "rejected")
                                      }
                                    >
                                      <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                      უარყოფა
                                    </Button>
                                  </>
                                )}
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
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
                                              <li>სულ დღეები: {vacation.total_days}</li>
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default VacationPageApprove
