import React, { useEffect, useState, useMemo } from "react"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import { getCurrentUserHrDocuments } from "services/hrDocument"
import MuiTable from "../../../components/Mui/MuiTable"
import { downloadHrDocument as downloadHrDocumentService } from "services/hrDocument"
import { Row, Col } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"

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

const UserHrDocuments = () => {
  document.title = "ჩემი დოკუმენტები | Gorgia LLC"
  const [documents, setDocuments] = useState([])

  const fetchDocuments = async () => {
    try {
      const response = await getCurrentUserHrDocuments()
      console.log(response.data)
      setDocuments(response.data)
    } catch (err) {
      console.error("Error fetching HR documents:", err)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const transformedHrDocuments = documents.map(document => ({
    id: document.id,
    status: STATUS_MAPPING[document.status] || document.status,
    created_at: document.created_at,
    user: {
      name:
        document.user?.name && document.user?.sur_name
          ? `${document.user.name} ${document.user.sur_name}`
          : "N/A",
      id: document.user.id_number,
      position: document.user.position,
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
        Header: "მიზანი",
        accessor: "purpose",
        disableSortBy: true,
      },
      {
        Header: "ხელფასი",
        accessor: "salary",
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
    ]
  }, [])

  const handleHrDocumentDownload = async hrDocumentId => {
    try {
      const response = await downloadHrDocumentService(hrDocumentId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "hr-document.pdf")
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("HR დოკუმენტი წარმატებით ჩამოიტვირთა")
    } catch (error) {
      console.error("Download failed:", error)
      toast.error(error.message || "ფაილი არ არის ხელმისაწვდომი ჩამოსატვირთად")
    }
  }

  const expandedRow = row => {
    return (
      <div>
        <div>კომენტარი: {row.comment}</div>
        {row.status === "approved" && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleHrDocumentDownload(row.id)}
          >
            <i className="bx bx-download me-1"></i>
            HR დოკუმენტის ჩამოტვირთვა
          </button>
        )}
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="HR დოკუმენტები"
                breadcrumbItem="ჩემი დოკუმენტები"
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
            renderRowDetails={expandedRow}
          />
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default UserHrDocuments
