import React, { useEffect, useState, useMemo } from "react"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { getHrDocuments, updateHrDocumentStatus } from "services/hrDocument"
import MuiTable from "../../../components/Mui/MuiTable"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
} from "@mui/material"
import { Row, Col, TabContent, Label, Spinner } from "reactstrap"
import { ErrorMessage, Field, Form, Formik } from "formik"
import DatePicker from "components/DatePicker"
import moment from "moment"

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

const DOCUMENT_TYPES = {
  PAID_EMPLOYMENT: "ხელფასიანი ცნობა",
  UNPAID_EMPLOYMENT: "უხელფასო ცნობა",
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

const HrPageApprove = () => {
  document.title = "HR დოკუმენტების ვიზირება | Gorgia LLC"
  const [documents, setDocuments] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedDocumentId, setSelectedDocumentId] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({})

  const fetchDocuments = async () => {
    try {
      const response = await getHrDocuments()
      setDocuments(response.data)
    } catch (err) {
      console.error("Error fetching HR documents:", err)
    }
  }

  const findDocument = async documentId => {
    const response = await getHrDocuments()
    const documentData = response.data.find(d => d.id === documentId)
    setFormData(data => ({
      ...data,
      user_id: documentData?.user?.id,
      is_other_user: documentData?.is_other_user !== 1 ? false : true,
      first_name:
        documentData?.is_other_user !== 1
          ? documentData?.user?.name
          : documentData?.first_name,
      last_name:
        documentData?.is_other_user !== 1
          ? documentData?.user?.sur_name
          : documentData?.last_name,
      documentType: documentData?.name,
      id_number:
        documentData.is_other_user !== 1
          ? documentData?.user?.id_number
          : documentData?.id_number,
      position:
        documentData?.is_other_user !== 1
          ? documentData?.user?.position
          : documentData?.position,
      working_start_date: "",
      purpose: documentData?.purpose,
      comment: "",
      salary: "",
      salary_text: "",
      template_num:
        Object.values(DOCUMENT_TYPES).findIndex(d => d === documentData.name) +
        1,
      document_number: "",
      started_date:
        documentData?.is_other_user !== 1
          ? documentData?.user?.working_start_date
          : documentData?.started_working_day,
    }))
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUpdateStatus = async (
    documentId,
    status,
    additionalData = {}
  ) => {
    setIsProcessing(true)
    try {
      const response = await updateHrDocumentStatus(
        documentId,
        status,
        additionalData
      )
      if (response.status === 200) {
        setDocuments(prevDocuments =>
          prevDocuments.map(doc =>
            doc.id === documentId ? { ...doc, ...response.data } : doc
          )
        )
        if (response.data.pdf_path) {
          printPdf(response.data.pdf_path)
        }
      }
    } catch (err) {
      console.error("Error updating document status:", err)
    } finally {
      fetchDocuments()
      setIsProcessing(false)
    }
  }

  const printPdf = filePath => {
    const newWindow = window.open(filePath)
    if (newWindow) {
      newWindow.focus()
      newWindow.print()
    }
  }

  const transformedHrDocuments = documents.map(document => ({
    id: document.id,
    status: STATUS_MAPPING[document.status] || document.status,
    created_at: document.created_at,
    user: {
      name:
        document.is_other_user !== 1 ? document.user.name : document.first_name,
      id:
        document.is_other_user !== 1
          ? document.user.id_number
          : document.id_number,
      position:
        document.is_other_user !== 1
          ? document.user.position
          : document.position,
    },
    name: document.name,
    salary: document.salary,
    purpose: document.purpose,
    comment: document.comment,
  }))

  const filterOptions = [
    {
      field: "status",
      label: "სტატუსი",
      valueLabels: {
        approved: "დამტკიცებული",
        rejected: "უარყოფილი",
        in_progress: "განხილვაში",
      },
    },
  ]

  const columns = useMemo(() => {
    return [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "სახელი",
        accessor: "user.name",
        disableSortBy: true,
      },
      {
        Header: "პირადი ნომერი",
        accessor: "user.id",
        disableSortBy: true,
      },
      {
        Header: "პოზიცია",
        accessor: "user.position",
        disableSortBy: true,
      },
      {
        Header: "დოკუმენტის ტიპი",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "ხელფასი",
        accessor: "salary",
      },
      {
        Header: "მიზანი",
        accessor: "purpose",
        disableSortBy: true,
      },
      {
        Header: "დამატების თარიღი",
        accessor: "created_at",
        Cell: ({ value }) => (
          <div>
            <i className="bx bx-calendar me-2"></i>
            {new Date(value).toLocaleDateString()}
          </div>
        ),
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor:
                value === "in_progress"
                  ? "#fff3e0"
                  : value === "rejected"
                  ? "#ffebee"
                  : value === "approved"
                  ? "#e8f5e9"
                  : "#f5f5f5",
              color:
                value === "in_progress"
                  ? "#e65100"
                  : value === "rejected"
                  ? "#c62828"
                  : value === "approved"
                  ? "#2e7d32"
                  : "#757575",
            }}
          >
            <i className={`bx ${statusMap[value].icon} me-2`}></i>
            {statusMap[value].label}
          </span>
        ),
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) =>
          row.original.status === "in_progress" && (
            <div className="d-flex gap-2">
              <div className="d-flex align-items-center">
                <Button
                  onClick={() => {
                    handleModalOpen("approved", row.original.id)
                    findDocument(row.original.id)
                  }}
                  color="success"
                  variant="contained"
                >
                  დამტკიცება
                </Button>
              </div>
              <div className="d-flex align-items-center">
                <Button
                  onClick={() => handleModalOpen("rejected", row.original.id)}
                  color="error"
                  variant="contained"
                >
                  უარყოფა
                </Button>
              </div>
            </div>
          ),
      },
    ]
  }, [])

  const handleModalOpen = (status, documentId) => {
    setSelectedStatus(status)
    setSelectedDocumentId(documentId)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedStatus(null)
    setSelectedDocumentId(null)
    setFormData({})
  }

  const handleConfirm = () => {
    handleUpdateStatus(selectedDocumentId, selectedStatus, formData)
    handleModalClose()
  }

  const hasWorkedSixMonths = startDate => {
    if (!startDate) return false
    const sixMonthsAgo = moment().subtract(6, "months")
    return moment(startDate).isBefore(sixMonthsAgo)
  }

  const isDocumentTypeDisabled = (type, started) => {
    if (isEmploymentDocument(type)) {
      const hasRequiredExperience = hasWorkedSixMonths(started)
      return !hasRequiredExperience
    }
    return false
  }

  const getDocumentTypeHelpText = type => {
    if (isEmploymentDocument(type) && isDocumentTypeDisabled(type)) {
      return "ამ ტიპის დოკუმენტის მოთხოვნა შესაძლებელია მხოლოდ 6 თვიანი სამუშაო სტაჟის შემდეგ"
    }
    return null
  }

  return (
    <React.Fragment>
      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="HR დოკუმენტები"
                breadcrumbItem="დოკუმენტების ვიზირება"
              />
            </Col>
          </Row>
          {isProcessing ? (
            <div className="text-center">
              <Spinner color="primary" />
              <p className="mt-2">
                გთხოვთ დაელოდოთ, მიმდინარეობს დამუშავება...
              </p>
            </div>
          ) : (
            <MuiTable
              data={transformedHrDocuments}
              columns={columns}
              filterOptions={filterOptions}
              enableSearch={true}
              searchableFields={[
                "user.name",
                "user.id",
                "salary",
                "name",
                "purpose",
              ]}
              renderRowDetails={row => <div>{row.comment}</div>}
            />
          )}
          <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>
              {selectedStatus === "approved"
                ? "დოკუმენტის დამტკიცება"
                : "დოკუმენტის უარყოფა"}
            </DialogTitle>

            <div className="mt-4">
              <Formik enableReinitialize initialValues={formData}>
                {({ values }) => (
                  <Form style={{ padding: "30px" }}>
                    <TabContent>
                      {selectedStatus === "approved" && (
                        <>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <Label className="form-label">სახელი</Label>

                              <Field
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={e =>
                                  setFormData(data => ({
                                    ...data,
                                    first_name: e.target.value,
                                  }))
                                }
                                className="form-control"
                              />

                              <ErrorMessage
                                name="first_name"
                                component="div"
                                className="text-danger mt-1"
                              />
                            </div>

                            <div className="col-md-6">
                              <Label className="form-label">გვარი</Label>

                              <Field
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={e =>
                                  setFormData(data => ({
                                    ...data,
                                    last_name: e.target.value,
                                  }))
                                }
                                className="form-control"
                              />

                              <ErrorMessage
                                name="last_name"
                                component="div"
                                className="text-danger mt-1"
                              />
                            </div>
                          </div>

                          {/* User Info */}
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <Label className="form-label">
                                დოკუმენტის ნომერი
                              </Label>

                              <Field
                                type="text"
                                name="document_number"
                                value={formData.document_number}
                                onChange={e =>
                                  setFormData(data => ({
                                    ...data,
                                    document_number: e.target.value,
                                  }))
                                }
                                className="form-control"
                              />

                              <ErrorMessage
                                name="document_number"
                                component="div"
                                className="text-danger mt-1"
                              />
                            </div>
                            <div className="col-md-6">
                              <div className="flex flex-row">
                                <Label className="form-label">
                                  დაწყების თარიღი
                                </Label>
                                {/* date! */}
                                <DatePicker
                                  startDate={formData?.started_date}
                                  handleStartedDate={setFormData}
                                  initialValue={formData?.started_date}
                                />
                              </div>
                              <ErrorMessage
                                name="started_date"
                                component="div"
                                className="text-danger mt-1"
                              />
                            </div>
                          </div>

                          <div className="mb-2">
                            <Label className="form-label">
                              დოკუმენტის ტიპი
                            </Label>
                            <Field
                              as="select"
                              name="documentType"
                              className="form-select"
                              value={formData.documentType}
                              onChange={e =>
                                setFormData(data => ({
                                  ...data,
                                  documentType: e.target.value,
                                }))
                              }
                            >
                              <option value="">აირჩიეთ დოკუმენტის ტიპი</option>
                              {Object.entries(DOCUMENT_TYPES).map(
                                ([key, type]) => (
                                  <option
                                    key={key}
                                    value={type}
                                    disabled={isDocumentTypeDisabled(
                                      type,
                                      formData.started_date
                                    )}
                                  >
                                    {type}
                                  </option>
                                )
                              )}
                            </Field>
                            <ErrorMessage
                              name="documentType"
                              component="div"
                              className="text-danger mt-1"
                            />
                            {getDocumentTypeHelpText(values.documentType) && (
                              <div className="text-warning mt-1">
                                <i className="bx bx-info-circle me-1"></i>
                                {getDocumentTypeHelpText(values.documentType)}
                              </div>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <Label className="form-label">
                                პირადო ნომერი
                              </Label>

                              <Field
                                type="text"
                                name="id_number"
                                value={formData.id_number}
                                onChange={e =>
                                  setFormData(data => ({
                                    ...data,
                                    id_number: e.target.value,
                                  }))
                                }
                                className="form-control"
                              />

                              <ErrorMessage
                                name="id_number"
                                component="div"
                                className="text-danger mt-1"
                              />
                            </div>

                            <div className="col-md-6">
                              <Label className="form-label">პოზიცია</Label>

                              <Field
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={e =>
                                  setFormData(data => ({
                                    ...data,
                                    position: e.target.value,
                                  }))
                                }
                                className="form-control"
                              />

                              <ErrorMessage
                                name="position"
                                component="div"
                                className="text-danger mt-1"
                              />
                            </div>
                          </div>
                          {/* Purpose field for paid documents */}
                          {isPaidDocument(values.documentType) && (
                            <>
                              <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                  <Label className="form-label">
                                    ანაზღაურება
                                  </Label>

                                  <Field
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={e =>
                                      setFormData(data => ({
                                        ...data,
                                        salary: e.target.value,
                                      }))
                                    }
                                    className="form-control"
                                  />

                                  <ErrorMessage
                                    name="salary"
                                    component="div"
                                    className="text-danger mt-1"
                                  />
                                </div>

                                <div className="col-md-6">
                                  <Label className="form-label">
                                    ანაზღაურება (ტექსტური)
                                  </Label>

                                  <Field
                                    type="text"
                                    name="salary_text"
                                    value={formData.salary_text}
                                    onChange={e =>
                                      setFormData(data => ({
                                        ...data,
                                        salary_text: e.target.value,
                                      }))
                                    }
                                    className="form-control"
                                  />

                                  <ErrorMessage
                                    name="salary_text"
                                    component="div"
                                    className="text-danger mt-1"
                                  />
                                </div>
                              </div>

                              <div className="mb-4">
                                <Label className="form-label">მიზანი</Label>
                                <Field
                                  type="text"
                                  name="purpose"
                                  className="form-control"
                                  value={formData.purpose}
                                  onChange={e =>
                                    setFormData(data => ({
                                      ...data,
                                      purpose: e.target.value,
                                    }))
                                  }
                                />
                                <ErrorMessage
                                  name="purpose"
                                  component="div"
                                  className="text-danger mt-1"
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}

                      <TextField
                        name="comment"
                        margin="dense"
                        label="კომენტარი"
                        type="text"
                        fullWidth
                        value={formData.comment}
                        onChange={e =>
                          setFormData(data => ({
                            ...data,
                            comment: e.target.value,
                          }))
                        }
                      />
                    </TabContent>
                  </Form>
                )}
              </Formik>
            </div>

            <DialogActions>
              <Button onClick={handleModalClose}>გაუქმება</Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                color={selectedStatus === "approved" ? "success" : "error"}
              >
                {selectedStatus === "approved" ? "დამტკიცება" : "უარყოფა"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </React.Fragment>
  )
}

export default HrPageApprove
