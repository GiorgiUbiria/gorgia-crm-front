import React, { useEffect, useState, useMemo } from "react"
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Form,
  FormGroup,
} from "reactstrap"
import {
  getVipLeads,
  createVipLead,
  updateVipLead,
  deleteVipLead,
} from "../../services/vipLeadsService"
import MuiTable from "components/Mui/MuiTable"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"

const VipLeadsPage = () => {
  const [vipLeads, setVipLeads] = useState([])
  const [vipLead, setVipLead] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [modal, setModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    leadId: null,
  })

  const fetchVipLeads = async () => {
    try {
      const response = await getVipLeads()
      setVipLeads(response || [])
    } catch (error) {
      console.error("Error fetching VIP leads:", error)
      setVipLeads([])
    }
  }

  useEffect(() => {
    fetchVipLeads()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "სახელი",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "ტელეფონის ნომერი",
        accessor: "phone",
        disableSortBy: true,
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
            <Link to={`/leads/vip/${row.original.id}`}>
              <Button onClick={() => {}} color="warning" variant="contained">
                მოთხოვნები
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    []
  )

  const transformedVipLeads = vipLeads.map(lead => ({
    id: lead.id,
    name: lead.first_name + " " + lead.last_name,
    phone: lead.phone,
  }))

  const handleDeleteClick = leadData => {
    setVipLead(leadData)
    setConfirmModal({ isOpen: true, type: "delete", leadId: leadData.id })
  }

  const handleDeleteVipLead = async () => {
    try {
      await deleteVipLead(vipLead.id)
      fetchVipLeads()
      setConfirmModal({ isOpen: false, type: null, leadId: null })
    } catch (error) {
      console.error("Error deleting VIP lead:", error)
    }
  }

  const handleSaveVipLead = async event => {
    event.preventDefault()
    const data = new FormData(event.target)
    const leadData = {
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      phone: data.get("phone"),
    }

    try {
      if (isEdit) {
        await updateVipLead(vipLead.id, leadData)
      } else {
        console.log(leadData)
        await createVipLead(leadData)
      }
      fetchVipLeads()
      setModal(false)
    } catch (error) {
      console.error("Error saving VIP lead:", error)
    }
  }

  const handleModalOpen = (type, leadData = null) => {
    setIsEdit(type === "edit")
    console.log(leadData)
    setVipLead(leadData)
    setModal(true)
  }

  return (
    <>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          <MuiTable data={transformedVipLeads} columns={columns} />
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
            <Button onClick={handleDeleteVipLead} color="error" autoFocus>
              წაშლა
            </Button>
          </DialogActions>
        </Dialog>

        <Modal isOpen={modal} toggle={() => setModal(!modal)}>
          <ModalHeader toggle={() => setModal(!modal)}>
            {isEdit ? "განახლება" : "დამატება"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSaveVipLead}>
              <FormGroup>
                <Label for="first_name">სახელი</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={vipLead ? vipLead.name.split(" ")[0] : ""}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="last_name">გვარი</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={vipLead ? vipLead.name.split(" ")[1] : ""}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">ტელეფონის ნომერი</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={vipLead ? vipLead.phone : ""}
                  maxLength={9}
                  required
                />
              </FormGroup>
              <Col style={{ textAlign: "right" }}>
                <Button type="submit" color="primary">
                  {isEdit ? "გნახლება" : "დამატება"}
                </Button>
              </Col>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </>
  )
}

export default VipLeadsPage
