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
import {
  getDepartmentAgreements,
  updateAgreementStatus,
} from "services/agreement"

const LawyerPageApprove = ({ filterStatus }) => {
  document.title = "ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([])
  const [agreements, setAgreements] = useState([])
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  const fetchAgreements = async () => {
    try {
      const response = await getDepartmentAgreements()

      console.log(response);
      
      setAgreements(response.data.data)
    } catch (err) {
      console.error("Error fetching agreements:", err)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const handleUpdateStatus = async (agreementId, status) => {
    try {
      const response = await updateAgreementStatus(agreementId, status);
  
      setAgreements(prevAgreements =>
        prevAgreements.map(agreement =>
          agreement.id === agreementId ? { ...agreement, status } : agreement
        )
      );
  
      if (status === 'approved' && response.data.file_path) {
        const filePath = response.data.file_path;
        printPdf(filePath);
      }
    } catch (err) {
      console.error("Error updating agreement status:", err);
    }
  };
  
  const printPdf = (filePath) => {
    const newWindow = window.open(filePath);
      newWindow.focus();
        newWindow.print();
  
  };

  const filteredAgreements = agreements
    .filter(agreement => 
      agreement.performer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(agreement => 
      filterStatus ? filterStatus.includes(agreement.status) : true
    );

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs title="ხელშეკრულებები" breadcrumbItem="ვიზირება" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xl={{ size: 4, offset: 8 }}>
              <Input
                type="search"
                placeholder="ძებნა შემსრულებლის მიხედვით..."
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
                  <CardTitle className="h4">
                    ხელშეკრულებების ვიზირების გვერდი
                  </CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ვიზირების დადასტურების გვერდი ქვევით ნაჩვენებია მხოლოდ მიმდინარე
                    მოთხოვნილი ვიზირებები
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>შემსრულებელი</th>
                          <th>მომსახურების აღწერა</th>
                          <th>ხელშეკრულების ვადა</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAgreements.map((agreement, index) => (
                          <React.Fragment key={agreement.id}>
                            <tr
                              className="table-warning"
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{agreement.performer_name}</td>
                              <td>{agreement.service_description}</td>
                              <td>{agreement.contract_duration} დღე</td>
                              <td>
                                {agreement.status === "rejected" ? (
                                  <Button color="danger" disabled>
                                    <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                    უარყოფილია
                                  </Button>
                                ) : agreement.status === "approved" ? (
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
                                        handleUpdateStatus(agreement.id, "approved")
                                      }
                                    >
                                      <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                      დადასტურება
                                    </Button>
                                    <Button
                                      type="button"
                                      color="danger"
                                      onClick={() =>
                                        handleUpdateStatus(agreement.id, "rejected")
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
                                <td colSpan="5">
                                  <div className="p-3">
                                    <p>დეტალური ინფორმაცია</p>
                                    <ul>
                                      <li>
                                        შემსრულებლის სრული დასახელება:{" "}
                                        {agreement.performer_name}
                                      </li>
                                      <li>
                                        საიდენტიფიკაციო კოდი ან პირადი ნომერი:{" "}
                                        {agreement.id_code_or_personal_number}
                                      </li>
                                      <li>
                                        იურიდიული მისამართი / ფაქტიური მისამართი:{" "}
                                        {agreement.legal_or_actual_address}
                                      </li>
                                      <li>
                                        საბანკო რეკვიზიტები:{" "}
                                        {agreement.bank_account_details}
                                      </li>
                                      <li>
                                        დირექტორი ან წარმომადგენელი (მინდობილობა):{" "}
                                        {agreement.representative_name}
                                      </li>
                                      <li>
                                        საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა):{" "}
                                        {agreement.contact_info}
                                      </li>
                                      <li>
                                        ხელშეკრულების მოქმედების ვადის ათვლის
                                        პერიოდი: {agreement.contract_start_period}
                                      </li>
                                      <li>
                                        მომსახურების საგანი:{" "}
                                        {agreement.service_description}
                                      </li>
                                      <li>
                                        მომსახურების ფასი/გადახდის პირობები/გადახდის
                                        განსხვავებული პირობები:{" "}
                                        {agreement.service_price}
                                      </li>
                                      <li>
                                        გადახდის პირობები/გადახდის განსხვავებული
                                        პირობები: {agreement.payment_terms}
                                      </li>
                                      <li>
                                        მომსახურების გაწევის ადგილი:{" "}
                                        {agreement.service_location}
                                      </li>
                                      <li>
                                        ხელშეკრულების გაფორმების ინიციატორი და
                                        შესრულებაზე პასუხისმგებელი პირი:{" "}
                                        {agreement.contract_responsible_person}
                                      </li>
                                    </ul>
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

export default LawyerPageApprove
