import React, { useEffect, useState, useMemo } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Form,
  FormGroup,
  Button,
} from "reactstrap"
import { useTable, usePagination, useSortBy } from "react-table"
import { Link } from "react-router-dom"
import DeleteModal from "components/Common/DeleteModal"
import {
  getVipLeads,
  createVipLead,
  updateVipLead,
  deleteVipLead,
} from "../../services/vipLeadsService"
import Breadcrumbs from "components/Common/Breadcrumb"
import moment from "moment"
import useIsAdmin from "hooks/useIsAdmin"

const VipLeadsPage = () => {
  const [vipLeads, setVipLeads] = useState([])
  const [vipLead, setVipLead] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const isAdmin = useIsAdmin()

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
      { Header: "სახელი", accessor: "first_name" },
      { Header: "გვარი", accessor: "last_name" },
      { Header: "ტელეფონის ნომერი", accessor: "phone" },
      {
        Header: "მოქმედება",
        id: "actions",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            {isAdmin && (
              <>
                <Button
                  color="primary"
                  onClick={() => handleEditClick(row.original)}
                >
                  რედაქტირება
                </Button>
                <Button
                  color="danger"
                  onClick={() => handleDeleteClick(row.original)}
                >
                  წაშლა
                </Button>
              </>
            )}
            <Link to={`/vip-leads/${row.original.id}`}>
              <Button color="info">მოთხოვნები</Button>
            </Link>
          </div>
        ),
      },
    ],
    [vipLeads]
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: vipLeads,
      },
      usePagination
    )

  const handleAddClick = () => {
    setVipLead(null)
    setIsEdit(false)
    setModal(true)
  }

  const handleEditClick = leadData => {
    setVipLead(leadData)
    setIsEdit(true)
    setModal(true)
  }

  const handleDeleteClick = leadData => {
    setVipLead(leadData)
    setDeleteModal(true)
  }

  const handleDeleteVipLead = async () => {
    try {
      await deleteVipLead(vipLead.id)
      fetchVipLeads()
      setDeleteModal(false)
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

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteVipLead}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ლიდები" breadcrumbItem="VIP" />
          <Row className="mb-3">
            <Col style={{ textAlign: "right" }}>
              <Button
                color="success"
                className="btn-rounded waves-effect waves-light mb-2"
                onClick={handleAddClick}
              >
                დამატება
              </Button>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <table {...getTableProps()} className="table">
                    <thead>
                      {headerGroups.map(headerGroup => (
                        <tr
                          {...headerGroup.getHeaderGroupProps()}
                          key={`header-${headerGroup.id}`}
                        >
                          {headerGroup.headers.map(column => (
                            <th
                              {...column.getHeaderProps()}
                              key={`header-cell-${column.id}`}
                              style={{ verticalAlign: "middle" }}
                            >
                              {column.id === "created_at"
                                ? column.render("Header")
                                : column.render("Header").props?.children ||
                                  column.render("Header")}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {rows.map((row, index) => {
                        prepareRow(row)
                        return (
                          <tr
                            {...row.getRowProps()}
                            key={`row-${row.id || index}`}
                          >
                            {row.cells.map(cell => (
                              <td
                                {...cell.getCellProps()}
                                key={`cell-${row.id || index}-${
                                  cell.column.id
                                }`}
                                style={{ verticalAlign: "middle" }}
                              >
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
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
                    defaultValue={vipLead ? vipLead.first_name : ""}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="last_name">გვარი</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    defaultValue={vipLead ? vipLead.last_name : ""}
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
        </Container>
      </div>
    </React.Fragment>
  )
}

export default VipLeadsPage
