import React, { useEffect, useState } from "react"
import MuiTable from "components/Mui/MuiTable"
import { getCurrentUserHrAdditionalDocuments } from "services/hrDocument"
import { downloadHrAdditionalDocument } from "services/hrDocument"
import { toast } from "store/zustand/toastStore"
import useAuth from "hooks/useAuth"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import classnames from "classnames"

const STATUS_MAPPING = {
  pending: "მიმდინარე",
  approved: "დადასტურებული",
  rejected: "უარყოფილი",
}

const TYPE_MAPPING = {
  bulletin: "ბიულეტენი",
  doctor: "ექიმის ცნობა",
}

const UserHrAdditionalDocuments = () => {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [activeTab, setActiveTab] = useState("my")

  const fetchDocuments = async () => {
    try {
      const response = await getCurrentUserHrAdditionalDocuments()
      setDocuments(response.data)
    } catch (error) {
      console.error("Error fetching documents:", error)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDownload = async (documentId, index) => {
    try {
      await downloadHrAdditionalDocument(documentId, index)
      toast.success("ფაილი წარმატებით ჩამოიტვირთა", "წარმატება")
    } catch (error) {
      toast.error("ფაილის ჩამოტვირთვა ვერ მოხერხდა", "შეცდომა")
    }
  }

  const columns = [
    { Header: "#", accessor: "id" },
    {
      Header: "ტიპი",
      accessor: "type",
      Cell: ({ value }) => TYPE_MAPPING[value],
    },
    {
      Header: "სტატუსი",
      accessor: "status",
      Cell: ({ value }) => STATUS_MAPPING[value],
    },
    { Header: "შექმნის თარიღი", accessor: "created_at" },
    {
      Header: "ფაილები",
      accessor: "attachments",
      Cell: ({ value, row }) => (
        <div className="flex gap-2">
          {value.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDownload(row.original.id, index)}
              className="btn btn-primary btn-sm"
            >
              ფაილი {index + 1}
            </button>
          ))}
        </div>
      ),
    },
  ]

  const filteredDocuments = documents.filter(doc =>
    activeTab === "my" ? doc.user_id === user.id : doc.is_for_employee
  )

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Nav tabs className="nav-tabs-custom">
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "my" })}
            onClick={() => setActiveTab("my")}
          >
            ყველა გაგზავნილი ცნობა
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "employee" })}
            onClick={() => setActiveTab("employee")}
          >
            თანამშრომლების ცნობები
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="my">
          <div className="mt-4">
            <MuiTable
              data={filteredDocuments}
              columns={columns}
              enableSearch
              searchableFields={["type", "status"]}
            />
          </div>
        </TabPane>
        <TabPane tabId="employee">
          <div className="mt-4">
            <MuiTable
              data={filteredDocuments}
              columns={columns}
              enableSearch
              searchableFields={["type", "status"]}
            />
          </div>
        </TabPane>
      </TabContent>
    </div>
  )
}

export default UserHrAdditionalDocuments
