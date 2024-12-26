import React, { useEffect, useState, useMemo } from "react"
import {
  Row,
  Form,
  Label,
  Input,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../../services/leadsService"
import Button from "@mui/material/Button"
import MuiTable from "components/Mui/MuiTable"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

const statusMap = {
  Active: {
    label: "აქტიური",
    icon: "bx-time",
    color: "#FFA500",
  },
  Closed: {
    label: "დახურული",
    icon: "bx-check-circle",
    color: "#28a745",
  },
  Problem: {
    label: "უარყოფილი",
    icon: "bx-x-circle",
    color: "#dc3545",
  },
}

const STATUS_MAPPING = {
  Active: "Active",
  Closed: "Closed",
  Problem: "Problem",
}

const LeadsPage = () => {
  const [leads, setLeads] = useState([])
  const [lead, setLead] = useState(null)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    leadId: null,
  })
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const fetchLeads = async () => {
    try {
      const response = await getLeads()
      setLeads(response || [])
    } catch (error) {
      console.error("Error fetching leads:", error)
      setLeads([])
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleModalOpen = (type, leadData = null) => {
    setIsEdit(!!leadData)
    setLead(leadData)
    setModal(true)
  }

  const handleDeleteClick = leadId => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      leadId,
    })
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteLead(confirmModal.leadId)
      fetchLeads()
    } catch (error) {
      console.error("Error deleting lead:", error)
    } finally {
      setConfirmModal({ isOpen: false, type: null, leadId: null })
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "ლიდის სახელი",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "ლიდის მოთხოვნა",
        accessor: "request",
        disableSortBy: true,
      },
      {
        Header: "პასუხისმგებელი პირი",
        accessor: "responsible_person",
        disableSortBy: true,
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
      {
        Header: "კომენტარი",
        accessor: "comment",
        disableSortBy: true,
      },
      {
        Header: "თარიღი",
        accessor: "created_at",
        Cell: ({ value }) => <div>{new Date(value).toLocaleDateString()}</div>,
      },
      {
        Header: "მოქმედებები",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              onClick={() => handleModalOpen("edit", row.original)}
              color="primary"
              variant="contained"
            >
              რედაქტირება
            </Button>
            <Button
              onClick={() => handleDeleteClick(row.original.id)}
              color="error"
              variant="contained"
            >
              წაშლა
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  const transformedLeads = leads.map(lead => ({
    id: lead.id,
    status: STATUS_MAPPING[lead.status] || lead.status,
    created_at: lead.created_at,
    name: lead.first_name + " " + lead.last_name,
    request: lead.request,
    comment: lead.comment,
    responsible_person: lead.responsible_person,
  }))

  const filterOptions = [
    {
      field: "status",
      label: "სტატუსი",
      valueLabels: {
        ctive: "აქტიური",
        Closed: "დახურული",
        Problem: "პრობლემური",
      },
    },
  ]

  const handleSaveLead = async event => {
    event.preventDefault()
    const data = new FormData(event.target)
    const leadData = {
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      request: data.get("request"),
      responsible_person: data.get("responsible_person"),
      status: data.get("status"),
      comment: data.get("comment"),
    }

    try {
      if (isEdit) {
        await updateLead(lead.id, leadData)
      } else {
        await createLead(leadData)
      }
      fetchLeads()
      setModal(false)
    } catch (error) {
      console.error("Error saving lead:", error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Row className="mb-3">
        <Col className="d-flex justify-content-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleModalOpen("add")}
          >
            <i className="bx bx-plus me-1"></i>
            ლიდის დამატება
          </Button>
        </Col>
      </Row>
      <Row>
        <MuiTable
          data={transformedLeads}
          columns={columns}
          filterOptions={filterOptions}
          enableSearch={true}
          searchableFields={["name", "request", "responsible_person"]}
          initialPageSize={10}
        />
      </Row>
      <Dialog
        open={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, type: null, leadId: null })
        }
      >
        <DialogTitle>{"ლიდის წაშლა"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            დარწმუნებული ხართ, რომ გსურთ ლიდის წაშლა?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmModal({ isOpen: false, type: null, leadId: null })
            }
            color="primary"
          >
            გაუქმება
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            წაშლა
          </Button>
        </DialogActions>
      </Dialog>
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          {isEdit ? "რედაქტირება" : "დამატება"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSaveLead}>
            <Label for="first_name">სახელი</Label>
            <Input
              id="first_name"
              name="first_name"
              defaultValue={lead ? lead.name.split(" ")[0] : ""}
              required
            />
            <Label for="last_name">გვარი</Label>
            <Input
              id="last_name"
              name="last_name"
              defaultValue={lead ? lead.name.split(" ")[1] : ""}
              required
            />
            <Label for="request">მოთხოვნა</Label>
            <Input
              id="request"
              name="request"
              defaultValue={lead ? lead.request : ""}
              required
            />
            <Label for="responsible_person">პასუხისმგებელი პირი</Label>
            <Input
              id="responsible_person"
              name="responsible_person"
              defaultValue={lead ? lead.responsible_person : ""}
              required
            />
            <Label for="status">სტატუსი</Label>
            <Input
              type="select"
              name="status"
              defaultValue={lead ? lead.status : "Active"}
            >
              <option value="Active">აქტიური</option>
              <option value="Closed">დახურული</option>
              <option value="Problem">პრობლემური</option>
            </Input>
            <Label for="comment">კომენტარი</Label>
            <Input
              type="textarea"
              id="comment"
              name="comment"
              defaultValue={lead ? lead.comment : ""}
            />
            <Col style={{ textAlign: "right" }}>
              <Button
                style={{ marginTop: "10px" }}
                type="submit"
                color="primary"
              >
                {isEdit ? "განახლება" : "დამატება"}
              </Button>
            </Col>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default LeadsPage
