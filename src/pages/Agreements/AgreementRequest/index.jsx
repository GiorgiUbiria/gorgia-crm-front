import React, { useState } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import StandardAgreementForm from "../../../components/AgreementForms/Strandard/StandardAgreementForm"
import DeliveryAgreementForm from "../../../components/AgreementForms/DeliveryAcceptance/DeliveryAgreementForm"
import MarketingAgreementForm from "../../../components/AgreementForms/Marketing/MarketingAgreementForm"
import ServiceAgreementForm from "../../../components/AgreementForms/Service/ServiceAgreementForm"
import LocalAgreementForm from "../../../components/AgreementForms/Local/LocalAgreementForm"

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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:!bg-gray-800 rounded-lg shadow-sm mt-5">
          <div className="p-6">
            <div className="mb-4">
              <div className="lg:w-1/2">
                <form>
                  <div className="mb-3">
                    <label
                      htmlFor="agreementType"
                      className="block text-sm font-medium text-gray-700 dark:!text-gray-200 mb-2"
                    >
                      ხელშეკრულების ტიპი
                    </label>
                    <select
                      id="agreementType"
                      value={selectedAgreementType}
                      onChange={e => setSelectedAgreementType(e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:!border-gray-600 
                        shadow-sm focus:border-blue-500 focus:ring-blue-500 
                        dark:!bg-gray-700 dark:!text-white
                        sm:text-sm"
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
                    </select>
                  </div>
                </form>
              </div>
            </div>
            {renderAgreementForm()}
          </div>
        </div>
      </div>
    </>
  )
}

export default AgreementRequest
