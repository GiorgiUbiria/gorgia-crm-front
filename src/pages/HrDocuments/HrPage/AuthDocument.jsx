import React, { useEffect, useState } from 'react';

import {
  ModalBody,
  ModalFooter,
  FormFeedback,
  Label,
} from "reactstrap"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { TabContent, TabPane } from "reactstrap"
import { Button } from "reactstrap"
import useIsAdmin from 'hooks/useIsAdmin';
import { useSelector } from 'react-redux';
import * as Yup from "yup"

const statusMap = {
    in_progress: {
      label: "განხილვაში",
      icon: "bx-time",
      color: "#FFA500",
    },
    approved: {
      label: "დამტკიცებული",
      icon: "bx-check-circle",
      color: "#28a745",
    },
    rejected: {
      label: "უარყოფილი",
      icon: "bx-x-circle",
      color: "#dc3545",
    },
  }
  
  const STATUS_MAPPING = {
    in_progress: "in_progress",
    approved: "approved",
    rejected: "rejected",
  }

const getInitialValues = (activeTab, currentUser, selectedUser) => {
    if (activeTab === "1") {
      return {
        documentType: "",
        id_number: currentUser?.id_number || "",
        position: currentUser?.position || "",
        working_start_date: currentUser?.working_start_date || "",
        purpose: "",
      }
    } else if (activeTab === "2" && selectedUser) {
      return {
        selectedUser: selectedUser.id,
        documentType: "",
        id_number: selectedUser?.id_number || "",
        position: selectedUser?.position || "",
        working_start_date: selectedUser?.working_start_date || "",
        purpose: "",
      }
    } else {
      return {
        documentType: "",
        id_number: "",
        position: "",
        working_start_date: "",
        purpose: "",
      }
    }
  }

  const forUserValidationSchema = activeTab => {
    if (activeTab === "2") {
      return validationSchema.shape({
        selectedUser: Yup.string().required("მომხმარებლის არჩევა აუცილებელია"),
      })
    }
    return validationSchema
  }

  const DOCUMENT_TYPES = {
    PAID_EMPLOYMENT: "შრომითი ხელფასიანი",
    UNPAID_EMPLOYMENT: "შრომითი უხელფასო",
    PAID_PROBATION: "გამოსაცდელი ვადით ხელფასიანი",
    UNPAID_PROBATION: "გამოსაცდელი ვადით უხელფასო",
  }

  const isPaidDocument = type => {
    return (
      type === DOCUMENT_TYPES.PAID_EMPLOYMENT ||
      type === DOCUMENT_TYPES.PAID_PROBATION
    )
  }
  
  const isEmploymentDocument = type => {
    return (
      type === DOCUMENT_TYPES.PAID_EMPLOYMENT ||
      type === DOCUMENT_TYPES.UNPAID_EMPLOYMENT
    )
  }
  
  const hasWorkedSixMonths = startDate => {
    if (!startDate) return false
    const sixMonthsAgo = moment().subtract(6, "months")
    return moment(startDate).isBefore(sixMonthsAgo)
  }

  const validationSchema = Yup.object().shape({
    documentType: Yup.string().required("დოკუმენტის ტიპი აუცილებელია"),
    id_number: Yup.string().when("documentType", {
      is: isPaidDocument,
      then: () => Yup.string().required("პირადი ნომერი აუცილებელია"),
    }),
    position: Yup.string().when("documentType", {
      is: isPaidDocument,
      then: () => Yup.string().required("პოზიცია აუცილებელია"),
    }),
    working_start_date: Yup.date().when("documentType", {
      is: isPaidDocument,
      then: () => Yup.date().required("სამსახურის დაწყების თარიღი აუცილებელია"),
    }),
    purpose: Yup.string().when("documentType", {
      is: isPaidDocument,
      then: () => Yup.string().required("მიზანი აუცილებელია"),
    }),
  })


const AuthDocument = () => {
    const [modal, setModal] = useState(false)
    const [activeTab, setActiveTab] = useState("1")
    const reduxUser = useSelector(state => state.user.user)
    const [currentUser, setCurrentUser] = useState(reduxUser)
    const [selectedUser, setSelectedUser] = useState(null)
  
    const isAdmin = useIsAdmin()

    useEffect(() => {
        setCurrentUser(reduxUser)
      }, [reduxUser])


    const handleDocumentSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
          const contextUser = activeTab === "1" ? currentUser : selectedUser
    
          if (!contextUser) {
            toast.error("Selected user data is not available.")
            return
          }
    
          const missingFields = validateRequiredFields(values, contextUser)
    
          if (missingFields.length > 0) {
            const shouldUpdate = window.confirm(
              `შემდეგი ველები არ არის შევსებული: ${missingFields.join(", ")}. \n` +
                "გსურთ მათი განახლება?"
            )
    
            if (shouldUpdate) {
              const userData = {}
    
              missingFields.forEach(field => {
                userData[field] = values[field]
              })
    
              await updateUser(contextUser.id, userData)
    
              if (activeTab === "1") {
                setCurrentUser(prev => ({
                  ...prev,
                  ...userData,
                }))
              } else {
                setSelectedUser(prev => ({
                  ...prev,
                  ...userData,
                }))
              }
    
              toast.success("მომხმარებლის ინფორმაცია განახლდა")
            } else {
              return
            }
          }
    
          if (
            !validateWorkDuration(
              values.documentType,
              contextUser?.working_start_date
            )
          ) {
            return
          }
    
          const documentData = {
            name: values.documentType,
            user_id: contextUser.id,
            ...(isPaidDocument(values.documentType) && { purpose: values.purpose }),
          }
    
          await createHrDocument(documentData)
          handleSuccess()
          resetForm()
        } catch (err) {
          handleError(err)
        } finally {
          setSubmitting(false)
        }
      }

      const validateRequiredFields = (values, userContext) => {
        const missingFields = []
        if (isPaidDocument(values.documentType)) {
          if (!userContext?.id_number && !values.id_number)
            missingFields.push("id_number")
          if (!userContext?.position && !values.position)
            missingFields.push("position")
          if (!userContext?.working_start_date && !values.working_start_date)
            missingFields.push("working_start_date")
        }
        return missingFields
      }
    
      const validateWorkDuration = (documentType, startDate) => {
        const hasWorked6MonthsFlag = hasWorkedSixMonths(startDate)
    
        if (isEmploymentDocument(documentType) && !hasWorked6MonthsFlag) {
          toast.error(
            "შრომითი ცნობის მოთხოვნა შესაძლებელია მხოლოდ 6 თვეზე მეტი სტაჟის მქონე თანამშრომლებისთვის"
          )
          return false
        }
    
        if (!isEmploymentDocument(documentType) && hasWorked6MonthsFlag) {
          toast.error(
            "გამოსაცდელი ვადის ცნობის მოთხოვნა შესაძლებელია მხოლოდ 6 თვეზე ნაკლები სტაჟის მქონე თანამშრომლებისთვის"
          )
          return false
        }
    
        return true
      }
    
      const handleSuccess = () => {
        setModal(false)
        fetchHrDocuments()
        toast.success("დოკუმენტი წარმატებით შეიქმნა")
      }
    
      const handleError = err => {
        console.error("Error creating HR document:", err)
        toast.error("დოკუმენტის შექმნა ვერ მოხერხდა")
      }

    return(
        <Formik
          enableReinitialize
          initialValues={getInitialValues(activeTab, currentUser, selectedUser)}
          validationSchema={forUserValidationSchema(activeTab)}
          onSubmit={handleDocumentSubmit}
        >
          {({
            values,
            setValues,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <div className="mt-3">
                      <div className="mb-3">
                        <Label>დოკუმენტის ტიპი</Label>
                        <Field
                          as="select"
                          name="documentType"
                          className="form-control"
                        >
                          <option value="">აირჩიეთ დოკუმენტის ტიპი</option>
                          {Object.values(DOCUMENT_TYPES).map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="documentType"
                          component={FormFeedback}
                        />
                      </div>

                      {isPaidDocument(values.documentType) && (
                        <>
                          <div className="mb-3">
                            <Label>პირადი ნომერი</Label>
                            <Field
                              type="text"
                              name="id_number"
                              className="form-control"
                              disabled={currentUser?.id_number}
                            />
                            <ErrorMessage
                              name="id_number"
                              component={FormFeedback}
                            />
                          </div>

                          <div className="mb-3">
                            <Label>პოზიცია</Label>
                            <Field
                              type="text"
                              name="position"
                              className="form-control"
                              disabled={currentUser?.position}
                            />
                            <ErrorMessage
                              name="position"
                              component={FormFeedback}
                            />
                          </div>

                          <div className="mb-3">
                            <Label>მიზანი</Label>
                            <Field
                              type="text"
                              name="purpose"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="purpose"
                              component={FormFeedback}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </TabPane>

                </TabContent>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  შენახვა
                </Button>
                <Button color="secondary" onClick={() => setModal(!modal)}>
                  დახურვა
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
    )
}

export default AuthDocument;