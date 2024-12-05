import React, { useState } from "react"
import {
  Card,
  CardBody,
  Container,
  Form,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import StandardAgreementForm from "../../components/AgreementForms/Strandard/StandardAgreementForm"
import DeliveryAgreementForm from "../../components/AgreementForms/DeliveryAcceptance/DeliveryAgreementForm"
import MarketingAgreementForm from "../../components/AgreementForms/Marketing/MarketingAgreementForm"
import ServiceAgreementForm from "../../components/AgreementForms/Service/ServiceAgreementForm"
import "../../assets/scss/custom/pages/_lawyer.scss"

const AGREEMENT_TYPES = {
  STANDARD: "standard",
  DELIVERY: "delivery",
  MARKETING: "marketing",
  SERVICE: "service",
}

const LawyerPage = () => {
  document.title = "ხელშეკრულების მოთხოვნა | Gorgia LLC"
  const [selectedAgreementType, setSelectedAgreementType] = useState(
    AGREEMENT_TYPES.STANDARD
  )

  const renderAgreementForm = () => {
    switch (selectedAgreementType) {
      case AGREEMENT_TYPES.STANDARD:
        return <StandardAgreementForm />
      case AGREEMENT_TYPES.DELIVERY:
        return <DeliveryAgreementForm />
      case AGREEMENT_TYPES.MARKETING:
        return <MarketingAgreementForm />
      case AGREEMENT_TYPES.SERVICE:
        return <ServiceAgreementForm />
      default:
        return <StandardAgreementForm />
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Container fluid>
          <Breadcrumbs
            title="ხელშეკრულებები"
            breadcrumbItem="ხელშეკრულების მოთხოვნა"
          />

          <Card className="shadow-lg border-0 rounded-lg mt-5">
            <CardBody>
              <Row className="mb-4">
                <Col lg="6">
                  <Form>
                    <div className="mb-3">
                      <Label for="agreementType">ხელშეკრულების ტიპი</Label>
                      <Input
                        type="select"
                        id="agreementType"
                        value={selectedAgreementType}
                        onChange={e => setSelectedAgreementType(e.target.value)}
                      >
                        <option value={AGREEMENT_TYPES.STANDARD}>
                          ნასყიდობის ხელშეკრულება
                        </option>
                        <option value={AGREEMENT_TYPES.DELIVERY}>
                          მიღება-ჩაბარების ხელშეკრულება
                        </option>
                        <option value={AGREEMENT_TYPES.MARKETING}>
                          მარკეტინგის ხელშეკრულება
                        </option>
                        <option value={AGREEMENT_TYPES.SERVICE}>
                          მომსახურების ხელშეკრულება
                        </option>
                      </Input>
                    </div>
                  </Form>
                </Col>
              </Row>
              {renderAgreementForm()}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default LawyerPage
