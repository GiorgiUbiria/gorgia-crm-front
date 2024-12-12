import React, { useEffect, useState, useMemo } from "react"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { getHrDocuments, updateHrDocumentStatus, getHrDocument } from "services/hrDocument"
import MuiTable from "../../../components/Mui/MuiTable"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import { Row, Col, TabContent, TabPane, Label } from "reactstrap"
import { ErrorMessage, Field, Form, Formik } from "formik"

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
  PAID_EMPLOYMENT: "შელფასიანი ცნობა",
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
  const [currentDocument, setCurrentDocument] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectedDocumentId, setSelectedDocumentId] = useState(null)
  const [comment, setComment] = useState("")
  
  const initialValues = {
    first_name: currentDocument.is_other_user !== 1 ? currentDocument.user.name : currentDocument.first_name,
    last_name: currentDocument.is_other_user !== 1 ? currentDocument.user.sur_name : currentDocument.last_name,
    documentType: Object.values(DOCUMENT_TYPES).find(val => val === currentDocument.name),
    id_number: currentDocument.is_other_user !== 1 ? currentDocument.user.id_number : currentDocument.id_number,
    position: currentDocument.is_other_user !== 1 ? currentDocument.user.position : currentDocument.position,
    working_start_date: "",
    purpose: currentDocument?.purpose,
    comment: "",
  }
  const [formData, setFormData] = useState({})

  console.log(formData)

  const fetchDocuments = async () => {
    try {
      const response = await getHrDocuments()
      setDocuments(response.data)
    } catch (err) {
      console.error("Error fetching HR documents:", err)
    }
  }

  const fetchDocument = async (hrDocumentId) => {
    try {
      const response = await getHrDocument(hrDocumentId)
      setCurrentDocument(response.data)
    } catch (err) {
      console.error("Error fetching HR document:", err)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUpdateStatus = async (
    documentId,
    status,
    additionalData = {}
  ) => {
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
      name: document.is_other_user !== 1 ? document.user.name : document.first_name,
      id: document.is_other_user !== 1 ?  document.user.id_number : document.id_number,
      position: document.is_other_user !== 1 ? document.user.position : document.position,
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
                    fetchDocument(row.original.id)
                    setFormData(initialValues)
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
    setComment("")
    setFormData({})
  }

  const handleConfirm = () => {
    handleUpdateStatus(selectedDocumentId, selectedStatus, { comment })
    handleModalClose()
  }

  // const forUserValidationSchema = () => {
  //     return validationSchema.shape({
  //       first_name: Yup.string().required("მომხმარებლის სახელი აუცილებელია"),
  //       last_name: Yup.string().required("მომხმარებლის გვარი აუცილებელია"),
  //     })
  // }


    const handleDocumentSubmit = async (values, { setSubmitting, resetForm }) => {

      console.log(values)
      return;

      try {
        // const contextUser = currentUser
  
        // if (!contextUser) {
        //   toast.error("მომხმარებლის მონაცემები არ მოიძებნა")
        //   return
        // }
  
        // if (
        //   (activeTab === "2" || isAdmin) &&
        //   (values.id_number !== contextUser.id_number ||
        //     values.position !== contextUser.position)
        // ) {
        //   const updateData = {
        //     id_number: values.id_number,
        //     position: values.position,
        //   }
        //   if(activeTab === "1"){
        //     await updateUserIdNumber(updateData)
        //   }
        // }
  
        console.log(values)
        // CHECK
  
        const documentData = {
          name: values.documentType,
          user_id: contextUser.id,
          first_name: values.first_name,
          last_name: values.last_name,
          is_other_user: activeTab === "2" ? 1 : 0,
          position: activeTab === "2" ? values.position : null,
          id_number: activeTab === "2" ? values.id_number : null,
          ...(isPaidDocument(values.documentType) && { purpose: values.purpose }),
        }
  
        // console.log(documentData)
  
        await createHrDocument(documentData)
        toast.success("დოკუმენტი წარმატებით შეიქმნა")
  
        if (canAccessOtherTab && activeTab === "2") {
          navigate("/hr/documents/approve")
        } else {
          navigate("/hr/documents/my-requests")
        }
      } catch (err) {
        console.log(err)
        console.error("Error creating HR document:", err)
        toast.error("დოკუმენტის შექმნა ვერ მოხერხდა")
      } finally {
        setSubmitting(false)
      }
    }

    
  const renderUserForm = (values, tab) => (
    <>
    {tab === 2 && (
      <div className="row g-3 mb-4">
        {renderUserInfo('სახელი', 'first_name')}
        {renderUserInfo('გვარი', 'last_name')}
      </div>
    )}
    <div className="mb-4">
      <Label className="form-label">
        დოკუმენტის ტიპი
      </Label>
      <Field
        as="select"
        name="documentType"
        className="form-select"
      >
        <option value="">
          აირჩიეთ დოკუმენტის ტიპი
        </option>
        {Object.entries(DOCUMENT_TYPES).map(
          ([key, type]) => (
            <option
              key={key}
              value={type}
              disabled={tab === 1 && isDocumentTypeDisabled(type)}
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
      {getDocumentTypeHelpText(
        values.documentType
      ) && (
        <div className="text-warning mt-1">
          <i className="bx bx-info-circle me-1"></i>
          {getDocumentTypeHelpText(
            values.documentType
          )}
        </div>
      )}
    </div>

    {/* User Info */}
    <div className="row g-3 mb-4">
      {renderUserInfo('პირადი ნომერი', 'id_number')}
      {renderUserInfo('პოზიცია', 'position')}
    </div>

    {/* Purpose field for paid documents */}
    {isPaidDocument(values.documentType) && (
      <div className="mb-4">
        <Label className="form-label">მიზანი</Label>
        <Field
          type="text"
          name="purpose"
          className="form-control"
        />
        <ErrorMessage
          name="purpose"
          component="div"
          className="text-danger mt-1"
        />
      </div>
    )}
    </>
)

const isDocumentTypeDisabled = type => {

  return false
}

const hasWorkedSixMonths = startDate => {
  if (!startDate) return false
  const sixMonthsAgo = moment().subtract(6, "months")
  return moment(startDate).isBefore(sixMonthsAgo)
}

  const getDocumentTypeHelpText = type => {
    if (isEmploymentDocument(type) && isDocumentTypeDisabled(type)) {
      return "ამ ტიპის დოკუმენტის მოთხოვნა შესაძლებელია მხოლოდ 6 თვიანი სამუშაო სტაჟის შემდეგ"
    }
    return null
  }

    const renderUserInfo = (labelText, name) => (
        <div className="col-md-6">
          <Label className="form-label">{labelText}</Label>
          
            <Field type="text" name={name}  className="form-control" />
          
          <ErrorMessage
            name={name}
            component="div"
            className="text-danger mt-1"
          />
        </div>
    )

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
          <Dialog open={modalOpen} onClose={handleModalClose}>
            <DialogTitle>
              {selectedStatus === "approved"
                ? "დოკუმენტის დამტკიცება"
                : "დოკუმენტის უარყოფა"}
            </DialogTitle>
                {selectedStatus === "approved" ? (

                
                <div className="mt-4">
                    <Formik
                      enableReinitialize
                      initialValues={initialValues}
                      // validationSchema={forUserValidationSchema()}
                      onSubmit={handleDocumentSubmit}
                    >
                      {({ values }) => (
                        <Form>
                          <TabContent> 
                              {renderUserForm(values, 2)}

                              <TextField
                                name="comment"
                                margin="dense"
                                label="კომენტარი"
                                type="text"
                                fullWidth
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                              />
                          </TabContent>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  ) : (

                  

             <DialogContent>
              <TextField
                autoFocus
                name="comment"
                margin="dense"
                label="კომენტარი"
                type="text"
                fullWidth
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </DialogContent>
          )}
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
