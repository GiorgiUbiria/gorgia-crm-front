import React, { useEffect, useState } from "react"
import MuiTable from "components/Mui/MuiTable"
import { getHrAdditionalDocuments } from "services/hrDocument"
import { downloadHrAdditionalDocument } from "services/hrDocument"
import { toast } from "store/zustand/toastStore"
import { useUpdateHrAdditionalDocumentOneCStatus } from "queries/hrDocuments"
import useAuth from "hooks/useAuth"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
} from "reactstrap"

const STATUS_MAPPING = {
  pending: "მიმდინარე",
  approved: "დადასტურებული",
  rejected: "უარყოფილი",
}

const TYPE_MAPPING = {
  bulletin: "ბიულეტენი",
  doctor: "ექიმის ცნობა",
}

const HrAdditionalArchive = () => {
  const [documents, setDocuments] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [comment, setComment] = useState("")
  const { isHrMember, isDepartmentHeadAssistant } = useAuth()
  const updateOneCStatusMutation = useUpdateHrAdditionalDocumentOneCStatus()

  const isHrAssistant = isDepartmentHeadAssistant() || isHrMember()

  const fetchDocuments = async () => {
    try {
      const response = await getHrAdditionalDocuments()
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
      toast.success("ფაილი წარმატებით ჩამოიტვირთა", "წარმატება", {
        duration: 2000,
        size: "small",
      })
    } catch (error) {
      console.error("Download failed:", error)
      toast.error(
        error.message || "ფაილი არ არის ხელმისაწვდომი ჩამოსატვირთად",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
      )
    }
  }

  const handleOneCStatusUpdate = async (id, currentStatus) => {
    if (!currentStatus) {
      setSelectedDocument({ id, currentStatus })
      setModalOpen(true)
      return
    }

    try {
      updateOneCStatusMutation.mutate({
        id,
        data: {
          stored_in_one_c: !currentStatus,
          one_c_comment: "",
        },
      })
    } catch (error) {
      console.error("Error updating 1C status:", error)
    }
  }

  const handleModalSubmit = () => {
    if (!selectedDocument) return

    try {
      updateOneCStatusMutation.mutate({
        id: selectedDocument.id,
        data: {
          stored_in_one_c: !selectedDocument.currentStatus,
          one_c_comment:
            comment || `Stored in 1C on ${new Date().toLocaleDateString()}`,
        },
      })
      setModalOpen(false)
      setSelectedDocument(null)
      setComment("")
    } catch (error) {
      console.error("Error updating 1C status:", error)
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
    {
      Header: "1C სტატუსი",
      accessor: "one_c_status",
      Cell: ({ row }) => {
        const { status, stored_in_one_c } = row.original
        const isApproved = status === "approved"

        if (!isHrAssistant || (!isApproved && status !== "pending")) {
          return (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: stored_in_one_c ? "#28a745" : "#dc3545",
                fontSize: "0.8125rem",
              }}
            >
              <i
                className={`bx ${stored_in_one_c ? "bx-check" : "bx-x"} me-1`}
              ></i>
              {status === "pending"
                ? "ჯერ-ჯერობით არ არის დამტკიცებული"
                : stored_in_one_c
                ? "გადატანილია"
                : "არ არის გადატანილი"}
            </span>
          )
        }

        if (stored_in_one_c) {
          return (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "#28a745",
                fontSize: "0.8125rem",
              }}
            >
              <i className="bx bx-check me-1"></i>
              გადატანილია
            </span>
          )
        }

        return (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() =>
              handleOneCStatusUpdate(row.original.id, stored_in_one_c)
            }
            disabled={updateOneCStatusMutation.isLoading}
            style={{ fontSize: "0.8125rem" }}
          >
            {updateOneCStatusMutation.isLoading &&
            row.original.id === updateOneCStatusMutation.variables?.id ? (
              <Spinner size="sm" />
            ) : (
              <>
                <i className="bx bx-upload me-1"></i>
                გადატანა 1C-ში
              </>
            )}
          </button>
        )
      },
    },
  ]

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <MuiTable
        data={documents}
        columns={columns}
        enableSearch
        searchableFields={["type", "status"]}
      />

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          1C-ში გადატანის კომენტარი
        </ModalHeader>
        <ModalBody>
          <Input
            type="textarea"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="შეიყვანეთ კომენტარი (არასავალდებულო)"
            rows={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            გაუქმება
          </Button>
          <Button color="primary" onClick={handleModalSubmit}>
            შენახვა
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default HrAdditionalArchive
