import React, { useState } from "react"
import { Card, CardBody, Form, Input, Label, Row, Col } from "reactstrap"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import StandardAgreementForm from "../../../components/AgreementForms/Strandard/StandardAgreementForm"
import DeliveryAgreementForm from "../../../components/AgreementForms/DeliveryAcceptance/DeliveryAgreementForm"
import MarketingAgreementForm from "../../../components/AgreementForms/Marketing/MarketingAgreementForm"
import ServiceAgreementForm from "../../../components/AgreementForms/Service/ServiceAgreementForm"
import LocalAgreementForm from "../../../components/AgreementForms/Local/LocalAgreementForm"
import "../../../assets/scss/custom/pages/_lawyer.scss"

const AGREEMENT_TYPES = {
  STANDARD: "standard",
  DELIVERY: "delivery",
  MARKETING: "marketing",
  SERVICE: "service",
  LOCAL: "local",
}

const AgreementRequest = () => {
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
      case AGREEMENT_TYPES.LOCAL:
        return <LocalAgreementForm />
      default:
        return <StandardAgreementForm />
    }
  }

  return (
    <>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="border-0 rounded-md mt-5">
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
                        მიღება-ჩაბარების აქტი
                      </option>
                      <option value={AGREEMENT_TYPES.MARKETING}>
                        მარკეტინგული მომსახურების ხელშეკრულება
                      </option>
                      <option value={AGREEMENT_TYPES.SERVICE}>
                        მომსახურების ხელშეკრულება
                      </option>
                      <option value={AGREEMENT_TYPES.LOCAL}>
                        ადგილობრივი შესყიდვის ხელშეკრულება
                      </option>
                    </Input>
                  </div>
                </Form>
              </Col>
            </Row>
            {renderAgreementForm()}
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default AgreementRequest
