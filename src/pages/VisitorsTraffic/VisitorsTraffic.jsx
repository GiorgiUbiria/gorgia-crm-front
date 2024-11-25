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
  ModalFooter,
  Label,
  Input,
  Form,
  Button,
  Spinner,
} from "reactstrap"
import { useTable, usePagination, useSortBy } from "react-table"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import DeleteModal from "components/Common/DeleteModal"
import {
  getVisitorsTraffic,
  createVisitor,
  updateVisitor,
  deleteVisitor,
} from "../../services/visitorsTrafficService"
import Breadcrumbs from "components/Common/Breadcrumb"
import moment from "moment"

const VisitorsTraffic = () => {
  const [visitors, setVisitors] = useState([])
  const [visitor, setVisitor] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [filterType, setFilterType] = useState("daily")
  const [selectedBranch, setSelectedBranch] = useState("სულ")
  const [loading, setLoading] = useState(false)

  const offices = [
    "დიდუბის ფილიალი",
    "გლდანის ფილიალი",
    "საბურთალოს ფილიალი",
    "ვაკის ფილიალი",
    "ლილოს ფილიალი",
    "ბათუმის ფილიალი",
    "ზუგდიდის ფილიალი",
    "ქუთაისის ფილიალი",
    "გორის ფილიალი",
    "მარნეულის ფილიალი",
    "რუსთავის ფილიალი",
    "თელავის ფილიალი",
  ]

  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchVisitors = async () => {
    setLoading(true)
    try {
      const response = await getVisitorsTraffic()
      setVisitors(response.data)
    } catch (error) {
      console.error("Error fetching visitors traffic:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setVisitor(null)
    setIsEdit(false)
    toggleModal()
  }

  const handleEditClick = visitorData => {
    setVisitor(visitorData)
    setIsEdit(true)
    toggleModal()
  }

  const handleDeleteClick = visitorData => {
    setVisitor(visitorData)
    setDeleteModal(true)
  }

  const handleDeleteVisitor = async () => {
    try {
      await deleteVisitor(visitor.id)
      fetchVisitors()
      setDeleteModal(false)
    } catch (error) {
      console.error("Error deleting visitor traffic:", error)
    }
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  const handleFilterTypeChange = e => {
    setFilterType(e.target.value)
    if (e.target.value !== "specific") {
      setSpecificDate(null)
    }
  }

  const [specificDate, setSpecificDate] = useState(null)

  const filteredVisitors = useMemo(() => {
    let filtered = [...visitors]

    // Apply time filter
    if (filterType === "daily") {
      filtered = filtered.filter(visitor =>
        moment(visitor.date).isSame(moment(), "day")
      )
    } else if (filterType === "weekly") {
      filtered = filtered.filter(visitor =>
        moment(visitor.date).isSame(moment(), "week")
      )
    } else if (filterType === "monthly") {
      filtered = filtered.filter(visitor =>
        moment(visitor.date).isSame(moment(), "month")
      )
    } else if (filterType === "specific" && specificDate) {
      filtered = filtered.filter(visitor =>
        moment(visitor.date).isSame(moment(specificDate), "day")
      )
    }

    // Apply branch filter
    if (selectedBranch !== "სულ") {
      filtered = filtered.filter(visitor => visitor.office === selectedBranch)
    }

    return filtered
  }, [visitors, filterType, selectedBranch, specificDate])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "თარიღი",
        accessor: "date",
        Cell: ({ value }) => moment(value).format("YYYY-MM-DD"),
      },
      {
        Header: "ფილიალი",
        accessor: "office",
      },
      {
        Header: "მომხმარებლების რაოდენობა",
        accessor: "visitors_count",
      },
      {
        Header: "მოქმედება",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="success"
              size="sm"
              onClick={() => handleEditClick(row.original)}
            >
              <FaEdit />
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDeleteClick(row.original)}
            >
              <FaTrash />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredVisitors,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  )

  const handleSaveVisitor = async event => {
    event.preventDefault()
    const data = {
      date: event.target.date.value,
      office: event.target.office.value,
      visitors_count: event.target.visitors_count.value,
    }

    try {
      if (isEdit) {
        await updateVisitor(visitor.id, data)
      } else {
        await createVisitor(data)
      }
      fetchVisitors()
      toggleModal()
    } catch (error) {
      console.error("Error saving visitor traffic:", error)
    }
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteVisitor}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Confirmation"
        message="Are you sure you want to delete this visitor record?"
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="მარკეტინგი" breadcrumbItem="ვიზიტორები" />
          <Row className="mb-3">
            <Col md="4" className="mb-2">
              <Button
                color="success"
                className="btn-rounded waves-effect waves-light"
                onClick={handleAddClick}
              >
                <FaPlus className="me-2" />
                ინფორმაციის დამატება
              </Button>
            </Col>
            <Col md="4" className="mb-2">
              <Label for="filterType">ფილტრი:</Label>
              <Input
                type="select"
                id="filterType"
                value={filterType}
                onChange={handleFilterTypeChange}
              >
                <option value="daily">ყოველდღიური</option>
                <option value="weekly">ყოველკვირეული</option>
                <option value="monthly">ყოველთვიური</option>
                <option value="specific">სპეციალური თარიღი</option>
                <option value="overall">სულ</option>
              </Input>
              {filterType === "specific" && (
                <Input
                  type="date"
                  className="mt-2"
                  value={specificDate || ""}
                  onChange={e => setSpecificDate(e.target.value)}
                />
              )}
            </Col>
            <Col md="4" className="mb-2">
              <Label for="branchFilter">ფილიალი:</Label>
              <Input
                type="select"
                id="branchFilter"
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
              >
                <option value="სულ">სულ</option>
                {offices.map((office, index) => (
                  <option value={office} key={index}>
                    {office}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  {loading ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "200px" }}
                    >
                      <Spinner color="primary" />
                    </div>
                  ) : filteredVisitors.length === 0 ? (
                    <div className="text-center py-5">
                      <h5>
                        No visitor traffic data found for the selected filters.
                      </h5>
                    </div>
                  ) : (
                    <>
                      <table
                        {...getTableProps()}
                        className="table table-hover table-bordered table-striped"
                      >
                        <thead className="table-light">
                          {headerGroups.map((headerGroup, index) => (
                            <tr
                              {...headerGroup.getHeaderGroupProps()}
                              key={index}
                            >
                              {headerGroup.headers.map(column => (
                                <th
                                  {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                  )}
                                  key={column.id}
                                  style={{ cursor: "pointer" }}
                                >
                                  {column.render("Header")}
                                  <span>
                                    {column.isSorted
                                      ? column.isSortedDesc
                                        ? " 🔽"
                                        : " 🔼"
                                      : ""}
                                  </span>
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                          {page.map(row => {
                            prepareRow(row)
                            return (
                              <tr {...row.getRowProps()} key={row.id}>
                                {row.cells.map(cell => (
                                  <td
                                    {...cell.getCellProps()}
                                    key={cell.column.id}
                                  >
                                    {cell.render("Cell")}
                                  </td>
                                ))}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>

                      <div className="pagination d-flex justify-content-between align-items-center">
                        <div>
                          <Button
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                            size="sm"
                            className="me-1"
                          >
                            {"<<"}
                          </Button>
                          <Button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            size="sm"
                            className="me-1"
                          >
                            {"<"}
                          </Button>
                          <Button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            size="sm"
                            className="me-1"
                          >
                            {">"}
                          </Button>
                          <Button
                            onClick={() => gotoPage(pageOptions.length - 1)}
                            disabled={!canNextPage}
                            size="sm"
                          >
                            {">>"}
                          </Button>
                        </div>
                        <span>
                          გვერდი{" "}
                          <strong>
                            {pageIndex + 1} სულ {pageOptions.length}
                          </strong>
                        </span>
                        <div>
                          <Label for="pageSize" className="me-2">
                            ჩანაწები გვერდზე:
                          </Label>
                          <Input
                            type="select"
                            id="pageSize"
                            value={pageSize}
                            onChange={e => setPageSize(Number(e.target.value))}
                            style={{ width: "70px", display: "inline-block" }}
                          >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                              <option key={pageSize} value={pageSize}>
                                {pageSize}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>
              {isEdit ? "ინფორმაციის განახლება" : "ინფორმაციის დამატება"}
            </ModalHeader>
            <Form onSubmit={handleSaveVisitor}>
              <ModalBody>
                <Row>
                  <Col xs={12}>
                    <div className="mb-3">
                      <Label className="form-label">თარიღი</Label>
                      <Input
                        name="date"
                        type="date"
                        defaultValue={visitor ? visitor.date : ""}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">ფილიალი</Label>
                      <Input
                        name="office"
                        type="select"
                        defaultValue={visitor ? visitor.office : offices[0]}
                        required
                      >
                        {offices.map((office, index) => (
                          <option value={office} key={index}>
                            {office}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">
                        მომხმარებლების რაოდენობა
                      </Label>
                      <Input
                        name="visitors_count"
                        type="number"
                        defaultValue={visitor ? visitor.visitors_count : ""}
                        required
                      />
                    </div>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="success">
                  {isEdit ? "განახლება" : "დამატება"}
                </Button>
                <Button color="secondary" onClick={toggleModal}>
                  წაშლა
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default VisitorsTraffic
