import React, { useEffect, useState, useMemo } from "react"
import MuiTable from "../../../../components/Mui/MuiTable"
import { getDepartmentAgreements as getDeliveryDepartmentAgreements } from "services/deliveryAgreement"
import { expandedRows } from "./expandedRows"

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

const DeliveryAgreementArchive = () => {
  document.title = "ხელშეკრულებების არქივი | Gorgia LLC"
  const [agreements, setAgreements] = useState([])

  const fetchAgreements = async () => {
    try {
      const response = await getDeliveryDepartmentAgreements()
      setAgreements(response.data.data)
    } catch (err) {
      console.error("Error fetching agreements:", err)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [])

  const transformedAgreements = useMemo(() => {
    return agreements.map(agreement => {
      return {
        id: agreement.id,
        status: STATUS_MAPPING[agreement.status] || agreement.status,
        requested_by: agreement.user.name + " " + agreement.user.sur_name,
        created_at: new Date(agreement.created_at).toLocaleDateString(),
        updated_at: new Date(agreement.updated_at).toLocaleString(),
        accepted_at: agreement.accepted_at
          ? new Date(agreement.accepted_at).toLocaleString()
          : "-",
        rejected_at: agreement.rejected_at
          ? new Date(agreement.rejected_at).toLocaleString()
          : "-",
        jursdictional_unit: {
          name: agreement.jursdictional_name,
          id: agreement.jursdictional_id_number,
          address: agreement.jursdictional_address,
        },
        agreement_type: agreement.agreement_type,
        expanded: {
          jursdictional_unit: {
            name: agreement.jursdictional_name,
            id: agreement.jursdictional_id_number,
            address: agreement.jursdictional_address,
          },
          action_act: agreement.action_act,
          rejection_reason: agreement.rejection_reason || null,
          requested_by: agreement.user.name + " " + agreement.user.sur_name,
          agreement_type: agreement.agreement_type,
          cost: agreement.sum_cost,
          cost_type: agreement.sum_cost_type,
          director: {
            name: agreement.director_full_name,
            id: agreement.director_id_number,
          },
        },
      }
    })
  }, [agreements])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "მოითხოვა",
        accessor: "requested_by",
        disableSortBy: true,
      },
      {
        Header: "იურიდიული პირის დასახელება",
        accessor: "jursdictional_unit.name",
        disableSortBy: true,
      },
      {
        Header: "ხელშეკრულების ტიპი",
        accessor: "agreement_type",
        disableSortBy: true,
      },
      {
        Header: "მოთხოვნის თარიღი",
        accessor: "created_at",
      },
      {
        Header: "სტატუსის ცვლილების თარიღი",
        accessor: row => {
          switch (row.status) {
            case "approved":
              return row.accepted_at
            case "rejected":
              return row.rejected_at
            default:
              return "-"
          }
        },
        id: "status_date",
      },
      {
        Header: "სტატუსი",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ value }) => {
          const status = statusMap[value] || {
            label: "უცნობი",
            icon: "bx-question-mark",
            color: "#757575",
          }

          return (
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
              <i className={`bx ${status.icon} me-2`}></i>
              {status.label}
            </span>
          )
        },
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

  return (
    <>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MuiTable
          columns={columns}
          data={transformedAgreements}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 15, 20]}
          enableSearch={true}
          searchableFields={["jursdictional_unit.name", "requested_by"]}
          filterOptions={filterOptions}
          onRowClick={() => {}}
          renderRowDetails={expandedRows}
        />
      </div>
    </>
  )
}

export default DeliveryAgreementArchive
