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
import * as XLSX from "xlsx"

const VisitorsTraffic = () => {
  const [visitors, setVisitors] = useState([])
  const [visitor, setVisitor] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [filterType, setFilterType] = useState("today")
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  })
  const [selectedMonth, setSelectedMonth] = useState({
    month: moment().month(),
    year: moment().year(),
  })
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
    setDateRange({ startDate: null, endDate: null })
    setSelectedMonth({ month: moment().month(), year: moment().year() })
  }

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const filteredVisitors = useMemo(() => {
    let filtered = [...visitors]

    switch (filterType) {
      case "today":
        filtered = filtered.filter(visitor =>
          moment(visitor.date).isSame(moment(), "day")
        )
        break
      case "monthly":
        filtered = filtered.filter(
          visitor =>
            moment(visitor.date).month() === selectedMonth.month &&
            moment(visitor.date).year() === selectedMonth.year
        )
        break
      case "specific":
        if (dateRange.startDate && dateRange.endDate) {
          filtered = filtered.filter(
            visitor =>
              moment(visitor.date).isSameOrAfter(
                moment(dateRange.startDate),
                "day"
              ) &&
              moment(visitor.date).isSameOrBefore(
                moment(dateRange.endDate),
                "day"
              )
          )
        }
        break
    }

    // Apply branch filter
    if (selectedBranch !== "სულ") {
      filtered = filtered.filter(visitor => visitor.office === selectedBranch)
    }

    return filtered
  }, [visitors, filterType, selectedBranch, dateRange, selectedMonth])

  const totalVisitors = useMemo(() => {
    return filteredVisitors.reduce(
      (sum, visitor) => sum + Number(visitor.visitors_count),
      0
    )
  }, [filteredVisitors])

  const getDateRangeString = () => {
    switch (filterType) {
      case "today":
        return moment().format("DD.MM.YYYY")
      case "monthly":
        return `${moment()
          .year(selectedMonth.year)
          .month(selectedMonth.month)
          .startOf("month")
          .format("DD.MM.YYYY")}-${moment()
          .year(selectedMonth.year)
          .month(selectedMonth.month)
          .endOf("month")
          .format("DD.MM.YYYY")}`
      case "specific":
        if (dateRange.startDate && dateRange.endDate) {
          return `${moment(dateRange.startDate).format("DD.MM.YYYY")}-${moment(
            dateRange.endDate
          ).format("DD.MM.YYYY")}`
        }
        return "სულ"
      default:
        return "სულ"
    }
  }

  const handleExportToExcel = () => {
    const dateRangeString = getDateRangeString()
    const branchText =
      selectedBranch === "სულ" ? "ყველა-ფილიალი" : selectedBranch

    const getFilterTypeInGeorgian = () => {
      switch (filterType) {
        case "daily":
          return "დღიური"
        case "weekly":
          return "კვირეული"
        case "monthly":
          return "თვიური"
        case "specific":
          return "კონკრეტული"
        default:
          return "სულ"
      }
    }

    const filename = `ვიზიტორები_${branchText}_${getFilterTypeInGeorgian()}_${dateRangeString.replace(
      /\//g,
      "-"
    )}.xlsx`

    const exportData = [
      ["თარიღი", "ფილიალი", "მომხმარებლების რაოდენობა"],
      ...filteredVisitors.map(visitor => [
        moment(visitor.date).format("DD.MM.YYYY"),
        visitor.office,
        visitor.visitors_count,
      ]),
      ["ჯამი", "", totalVisitors],
    ]

    const ws = XLSX.utils.aoa_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "ვიზიტორები")
    XLSX.writeFile(wb, filename)
  }

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
            <Col md="3" className="mb-2">
              <Button
                color="success"
                className="btn-rounded waves-effect waves-light"
                onClick={handleAddClick}
              >
                <FaPlus className="me-2" />
                ინფორმაციის დამატება
              </Button>
            </Col>
            <Col md="3" className="mb-2">
              <Label for="filterType">ფილტრი:</Label>
              <Input
                type="select"
                id="filterType"
                value={filterType}
                onChange={handleFilterTypeChange}
              >
                <option value="today">დღევანდელი</option>
                <option value="monthly">თვიური</option>
                <option value="specific">კონკრეტული პერიოდი</option>
                <option value="overall">სულ</option>
              </Input>

              {filterType === "specific" && (
                <div className="mt-2">
                  <Input
                    type="date"
                    className="mb-2"
                    value={dateRange.startDate || ""}
                    onChange={e =>
                      handleDateRangeChange("startDate", e.target.value)
                    }
                    placeholder="საწყისი თარიღი"
                  />
                  <Input
                    type="date"
                    value={dateRange.endDate || ""}
                    onChange={e =>
                      handleDateRangeChange("endDate", e.target.value)
                    }
                    placeholder="საბოლოო თარიღი"
                  />
                </div>
              )}

              {filterType === "monthly" && (
                <div className="mt-2 d-flex gap-2">
                  <Input
                    type="select"
                    value={selectedMonth.month}
                    onChange={e =>
                      setSelectedMonth(prev => ({
                        ...prev,
                        month: parseInt(e.target.value),
                      }))
                    }
                  >
                    {moment.months().map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </Input>
                  <Input
                    type="select"
                    value={selectedMonth.year}
                    onChange={e =>
                      setSelectedMonth(prev => ({
                        ...prev,
                        year: parseInt(e.target.value),
                      }))
                    }
                  >
                    {Array.from(
                      { length: 5 },
                      (_, i) => moment().year() - i
                    ).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Input>
                </div>
              )}

              {filterType !== "overall" && (
                <div className="mt-2 text-muted small">
                  პერიოდი: {getDateRangeString()}
                </div>
              )}
            </Col>
            <Col md="2" className="mb-2">
              <Label for="branchFilter">ფილიალი:</Label>
              <Input
                type="select"
                id="branchFilter"
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
              >
                <option value="სულ">ყველა</option>
                {offices.map((office, index) => (
                  <option value={office} key={index}>
                    {office}
                  </option>
                ))}
              </Input>
            </Col>
            <Col md="2" className="mb-2">
              <Label>ჯამი:</Label>
              <div
                className="form-control"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                {`${totalVisitors} ${
                  filterType !== "overall" ? `(${getDateRangeString()})` : ""
                }`}
              </div>
            </Col>
            <Col md="2" className="mb-2">
              <Label>&nbsp;</Label>
              <Button
                color="primary"
                className="w-100"
                onClick={handleExportToExcel}
              >
                <i className="bx bx-download me-1"></i>
                ექსპორტი Excel-ში
              </Button>
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
                        მოხმარებლების რაოდენობა
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
