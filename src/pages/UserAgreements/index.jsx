import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import MuiTable from "../../components/Mui/MuiTable"
import { getUserAgreemnets } from "services/agreement"

const statusMap = {
  pending: {
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
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
}

const UserAgreements = () => {
  document.title = "ჩემი ხელშეკრულებები | Gorgia LLC"
  const [agreements, setAgreements] = useState([])

  const fetchAgreements = async () => {
    try {
      const response = await getUserAgreemnets()
      setAgreements(response.data.data)
    } catch (err) {
      console.error("Error fetching agreements:", err)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const transformedAgreements = agreements.map(agreement => ({
    id: agreement.id,
    status: STATUS_MAPPING[agreement.status] || agreement.status,
    created_at: agreement.created_at,
    user: {
      name: agreement.performer_name,
      id: agreement.id_code_or_personal_number,
      position: agreement.service_description,
      location: agreement.legal_or_actual_address,
    },
    name: agreement.service_description,
    salary: agreement.service_price,
    comment: agreement.payment_terms,
    file_path: agreement.file_path,
  }))

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "მომთხოვნი სახელი",
        accessor: "user.name",
        Cell: ({ value }) => (
          <div className="d-flex align-items-center">
            <div className="avatar-wrapper">
              <span className="avatar-initial">{value.charAt(0) || "?"}</span>
            </div>
            <span className="user-name">{value}</span>
          </div>
        ),
      },
      {
        Header: "მოთხოვნილი ფორმის სტილი",
        accessor: "name",
      },
      {
        Header: "თარიღი",
        accessor: "created_at",
        sortType: "basic",
        Cell: ({ value }) => (
          <div className="date-wrapper">
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
                value === "pending"
                  ? "#fff3e0"
                  : value === "rejected"
                  ? "#ffebee"
                  : value === "approved"
                  ? "#e8f5e9"
                  : "#f5f5f5",
              color:
                value === "pending"
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
    ],
    []
  )

  const filterOptions = [
    {
      field: "status",
      label: "სტატუსი",
      valueLabels: {
        approved: "დამტკიცებული",
        rejected: "უარყოფილი",
        pending: "განხილვაში",
      },
    },
  ]

  const expandedRow = useCallback(row => {
    const handleDownload = async () => {
      try {
        // First verify file exists
        const response = await fetch(row.file_path, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error('File not found');
        }

        const link = document.createElement('a');
        link.href = row.file_path;
        link.download = row.file_path.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        alert("Sorry, the file is not available for download at this moment.")
        console.error("Download error:", error)
      }
    };

    return (
      <div>
        <p>{row.comment}</p>
        {row.file_path && (
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleDownload}
          >
            <i className="bx bx-download me-1"></i>
            ფაილის ჩამოტვირთვა
          </button>
        )}
      </div>
    )
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="ხელშეკრულებები"
                breadcrumbItem="ჩემი ხელშეკრულებები"
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <MuiTable
                    columns={columns}
                    data={transformedAgreements}
                    initialPageSize={10}
                    pageSizeOptions={[5, 10, 15, 20]}
                    enableSearch={true}
                    searchableFields={["user.name", "name"]}
                    filterOptions={filterOptions}
                    onRowClick={() => {}}
                    renderRowDetails={expandedRow}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserAgreements
