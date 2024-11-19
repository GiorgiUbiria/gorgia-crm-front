import React, { useEffect, useState, useMemo } from "react";
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
  Button,
} from "reactstrap";
import { useTable, usePagination, useSortBy } from "react-table";
import DeleteModal from "components/Common/DeleteModal";
import {
  getVisitorsTraffic,
  createVisitor,
  updateVisitor,
  deleteVisitor,
} from "../../services/visitorsTrafficService";
import Breadcrumbs from "components/Common/Breadcrumb";
import moment from "moment";

const VisitorsTraffic = () => {
  const [visitors, setVisitors] = useState([]);
  const [visitor, setVisitor] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [filterType, setFilterType] = useState("daily");

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
  ];

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await getVisitorsTraffic();
      setVisitors(response.data);
    } catch (error) {
      console.error("Error fetching visitors traffic:", error);
    }
  };

  const handleAddClick = () => {
    setVisitor(null);
    setIsEdit(false);
    toggleModal();
  };

  const handleEditClick = (visitorData) => {
    // Set the current visitor data to be edited
    setVisitor(visitorData);

    // Set edit mode to true
    setIsEdit(true);

    // Open the modal
    toggleModal();
  };

  const handleDeleteClick = (visitorData) => {
    setVisitor(visitorData);
    setDeleteModal(true);
  };

  const handleDeleteVisitor = async () => {
    try {
      await deleteVisitor(visitor.id);
      fetchVisitors();
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting visitor traffic:", error);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  // Date Filter Logic
  const filteredVisitors = useMemo(() => {
    if (filterType === "daily") {
      return visitors.filter((visitor) =>
        moment(visitor.date).isSame(moment(), "day")
      );
    } else if (filterType === "weekly") {
      return visitors.filter((visitor) =>
        moment(visitor.date).isSame(moment(), "week")
      );
    } else if (filterType === "monthly") {
      return visitors.filter((visitor) =>
        moment(visitor.date).isSame(moment(), "month")
      );
    } else {
      return visitors;
    }
  }, [visitors, filterType]);

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
            <button
              className="btn btn-success"
              onClick={() => handleEditClick(row.original)}
            >
              <i className="mdi mdi-pencil"></i>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteClick(row.original)}
            >
              <i className="mdi mdi-delete"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

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
  );

  const handleSaveVisitor = async (event) => {
    event.preventDefault();
    const data = {
      date: event.target.date.value,
      office: event.target.office.value,
      visitors_count: event.target.visitors_count.value,
    };

    try {
      if (isEdit) {
        await updateVisitor(visitor.id, data);
      } else {
        await createVisitor(data);
      }
      fetchVisitors();
      toggleModal();
    } catch (error) {
      console.error("Error saving visitor traffic:", error);
    }
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteVisitor}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="მარკეტინგი" breadcrumbItem="ვიზიტორები" />
          <Row className="mb-3">
            <Col>
              <Button
                color="success"
                className="btn-rounded waves-effect waves-light mb-2"
                onClick={handleAddClick}
              >
                ინფორმაციის დამატება
              </Button>
            </Col>
            <Col sm="4">
              <Label for="filter">ფილტრი:</Label>
              <Input
                type="select"
                id="filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="daily">ყოველდღიური</option>
                <option value="weekly">ყოველკვირეული</option>
                <option value="monthly">ყოველთვიური</option>
              </Input>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <table
                    {...getTableProps()}
                    className="table table-hover table-bordered table-striped"
                  >
                    <thead className="table-light">
                      {headerGroups.map((headerGroup, index) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                          {headerGroup.headers.map((column) => (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                              key={column.id}
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
                      {page.length === 0 ? (
                        <tr>
                          <td colSpan={columns.length} className="text-center">
                            No visitor traffic data found
                          </td>
                        </tr>
                      ) : (
                        page.map((row) => {
                          prepareRow(row);
                          return (
                            <tr {...row.getRowProps()} key={row.id}>
                              {row.cells.map((cell) => (
                                <td {...cell.getCellProps()} key={cell.column.id}>
                                  {cell.render("Cell")}
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>

                  <div className="pagination d-flex justify-content-center">
                    <Button
                      onClick={() => gotoPage(0)}
                      disabled={!canPreviousPage}
                    >
                      {"<<"}
                    </Button>{" "}
                    <Button
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      {"<"}
                    </Button>{" "}
                    <span className="mx-2">
                      გვერდი{" "}
                      <strong>
                        {pageIndex + 1} სულ  {pageOptions.length}
                      </strong>{" "}
                    </span>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>
                      {">"}
                    </Button>{" "}
                    <Button
                      onClick={() => gotoPage(pageOptions.length - 1)}
                      disabled={!canNextPage}
                    >
                      {">>"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>
              {isEdit ? "ინფორმაციის განახლება" : "ინფორმაციის დამატება"}
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSaveVisitor}>
                <Row>
                  <Col xs={12}>
                    <div className="mb-3">
                      <Label className="form-label">თარიღი</Label>
                      <Input
                        name="date"
                        type="date"
                        defaultValue={visitor ? visitor.date : ""}
                      />
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">ფილიალი</Label>
                      <Input name="office" type="select" defaultValue={visitor ? visitor.office : offices[0]}>
                        {offices.map((office, index) => (
                          <option value={office} key={index}>
                            {office}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">მომხმარებლების რაოდენობა</Label>
                      <Input
                        name="visitors_count"
                        type="number"
                        defaultValue={visitor ? visitor.visitors_count : ""}
                        required
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <Button type="submit" color="success">
                        {isEdit ? "განახლება" : "დამატება"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VisitorsTraffic;
