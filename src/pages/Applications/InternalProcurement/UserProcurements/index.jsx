import React, { useEffect, useState, useMemo } from "react"
import { Row, Col, Button } from "reactstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { getPurchaseList, downloadPurchaseFile } from "../../../../services/purchase"
import MuiTable from "../../../../components/Mui/MuiTable"

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

const handleDownload = async (id) => {
  try {
    const response = await downloadPurchaseFile(id);
    // Get the filename from the Content-Disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    let filename = `purchase-${id}-document.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('ფაილის ჩამოტვირთვა ვერ მოხერხდა');
  }
};

const ExpandedRowContent = ({ rowData }) => {
  const details = [
    { label: "მიწოდების ვადა", value: rowData.deadline },
    { label: "მოკლე ვადის მიზეზი", value: rowData.short_period_reason },
    { label: "მარაგის მიზანი", value: rowData.stock_purpose },
    { label: "მარკა/მოდელი", value: rowData.brand_model },
    { label: "ალტერნატივა", value: rowData.alternative },
    {
      label: "კონკურენტული ფასი",
      value: rowData.competitive_price || "არ არის მითითებული",
    },
    {
      label: "იგეგმება თუ არა მომდევნო თვეში",
      value: rowData.planned_next_month,
    },
    { label: "თანხის ანაზღაურება", value: rowData.who_pay_amount },
    {
      label: "პასუხისმგებელი თანამშრომელი",
      value: rowData.name_surname_of_employee,
    },
  ]

  return (
    <div className="p-3 bg-light rounded">
      {rowData.comment && (
        <div className="mb-3">
          <span className="fw-bold text-danger">უარყოფის მიზეზი: </span>
          <p className="mb-0">{rowData.comment}</p>
        </div>
      )}
      <div className="row g-2">
        {details.map((detail, index) => (
          <div key={index} className="col-md-6">
            <span className="fw-bold">{detail.label}: </span>
            <span>{detail.value}</span>
          </div>
        ))}
      </div>
      {rowData.file_path && rowData.status === "approved" && (
        <div className="mt-3">
          <Button 
            color="primary"
            onClick={() => handleDownload(rowData.id)}
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            დოკუმენტის ჩამოტვირთვა
          </Button>
        </div>
      )}
    </div>
  )
}

const UserProcurement = () => {
  document.title = "ჩემი შესყიდვები | Gorgia LLC"
  const [procurements, setProcurements] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 0,  // MUI pagination is 0-based
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  })

  const fetchProcurements = async (page = 0, pageSize = 10) => {
    try {
      setLoading(true)
      const response = await getPurchaseList(false, page + 1, pageSize) // Adding +1 because backend is 1-based
      setProcurements(response.data.internal_purchases)
      setPagination({
        currentPage: page,
        totalPages: response.data.pagination.total_pages,
        totalItems: response.data.pagination.total,
        pageSize: pageSize
      })
    } catch (err) {
      console.error("Error fetching purchases:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage, pageSize) => {
    fetchProcurements(newPage, pageSize)
  }

  useEffect(() => {
    fetchProcurements()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
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
        disableSortBy: true,
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
      {
        Header: "მიზანი",
        accessor: "objective",
        disableSortBy: true,
      },
      {
        Header: "მიზეზი",
        accessor: "reason",
        disableSortBy: true,
      },
      {
        Header: "დეპარტამენტი",
        accessor: "department",
        disableSortBy: true,
      },
      {
        Header: "მიღებული მისამართი",
        accessor: "delivery_address",
        disableSortBy: true,
      },
      {
        Header: "შემმოწმებელი",
        accessor: "reviewer",
        disableSortBy: true,
      },
    ],
    []
  )

  const transformedPurchases = procurements.map(purchase => ({
    id: purchase.id,
    status: STATUS_MAPPING[purchase.status] || purchase.status,
    created_at: purchase.created_at,
    user: {
      name: purchase.performer_name,
      id: purchase.id_code_or_personal_number,
      position: purchase.service_description,
      location: purchase.legal_or_actual_address,
    },
    objective: purchase.objective,
    reason: purchase.reason,
    department: purchase.department?.name || "არ არის მითითებული",
    delivery_address: purchase.delivery_address,
    reviewer: purchase.reviewed_by
      ? `${purchase.reviewed_by.name || ""} ${
          purchase.reviewed_by.sur_name || ""
        }`
      : "არ არის მითითებული",
    comment: purchase.comment,
    deadline: purchase.deadline,
    short_period_reason: purchase.short_period_reason,
    stock_purpose: purchase.stock_purpose,
    brand_model: purchase.brand_model,
    alternative: purchase.alternative,
    competitive_price: purchase.competitive_price,
    planned_next_month: purchase.planned_next_month,
    who_pay_amount: purchase.who_pay_amount,
    name_surname_of_employee: purchase.name_surname_of_employee,
    file_path: purchase.file_path,
  }))

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
    {
      field: "department",
      label: "დეპარტამენტი",
    },
  ]

  const expandedRow = row => <ExpandedRowContent rowData={row} />

  return (
    <React.Fragment>
      <div className="page-content mb-4">
        <div className="container-fluid">
          <Row className="mb-3">
            <Col xl={12}>
              <Breadcrumbs
                title="განცხადებები"
                breadcrumbItem="ჩემი შესყიდვები"
              />
            </Col>
          </Row>
          <Row>
            <MuiTable
              data={transformedPurchases}
              columns={columns}
              filterOptions={filterOptions}
              enableSearch={true}
              searchableFields={["reviewer", "department"]}
              initialPageSize={pagination.pageSize}
              pageSizeOptions={[10, 25, 50, 100]}
              renderRowDetails={expandedRow}
              loading={loading}
              totalCount={pagination.totalItems}
              page={pagination.currentPage}
              onPageChange={handlePageChange}
            />
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserProcurement
