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
  FormFeedback,
  Input,
  Form,
  Button,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import DeleteModal from "components/Common/DeleteModal";
import { getContactList, createContact, updateContact, deleteContact } from "services/contactService";
import { ToastContainer } from "react-toastify";
import Breadcrumbs from "components/Common/Breadcrumb";

const ContactsList = () => {
  document.title = "Contact List | React Admin Dashboard";

  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [pageSizeState, setPageSizeState] = useState(10); // Renamed page size state
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await getContactList();
      setContacts(response);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (contact && contact.name) || "",
      surname: (contact && contact.surname) || "",
      id_number: (contact && contact.id_number) || "",
      mobile_number: (contact && contact.mobile_number) || "",
      email: (contact && contact.email) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter the contact's name"),
      surname: Yup.string().required("Please enter the contact's surname"),
      id_number: Yup.string().required("Please enter ID number"),
      mobile_number: Yup.string().required("Please enter mobile number"),
      email: Yup.string().email("Invalid email").required("Please enter email"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateContact(contact.id, values);
        } else {
          await createContact(values);
        }
        fetchContacts();
        toggleModal();
      } catch (error) {
        console.error("Error creating/updating contact:", error);
      }
    },
  });

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleUserClick = (user, event) => {
    event.preventDefault();
    setContact(user);
    setIsEdit(true);
    toggleModal();
  };

  const handleUserClicks = (event) => {
    event.preventDefault();
    setContact(null);
    setIsEdit(false);
    toggleModal();
  };

  const handleDeleteClick = (user, event) => {
    event.preventDefault();
    setContact(user);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      if (contact && contact.id) {
        await deleteContact(contact.id);
        fetchContacts();
      }
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Add a row index for the first column
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: ({ row }) => row.index + 1, // Row index instead of name initials
      },
      {
        Header: "სახელი",
        accessor: "name",
        Cell: ({ row }) => (
          <>
            <h5 className="font-size-14 mb-1">
              <span className="text-dark">{row.original.name}</span>
            </h5>
            <p className="text-muted mb-0">{row.original.surname}</p>
          </>
        ),
      },
      {
        Header: "პირადი ნომერი", // Ensure ID Number is displayed
        accessor: "id_number",
      },
      {
        Header: "ელ-ფოსტა",
        accessor: "email",
      },
      {
        Header: "მობილურის ნომერი",
        accessor: "mobile_number",
      },
      {
        Header: "მოქმედება",
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
            <button
              className="btn btn-success"
              onClick={(e) => handleUserClick(row.original, e)}
            >
              <i className="mdi mdi-pencil font-size-18" />
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteClick(row.original, e)}
            >
              <i className="mdi mdi-delete font-size-18" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Filter function for search
  const filteredData = useMemo(() => {
    return contacts.filter((contact) =>
      Object.keys(contact).some((key) =>
        contact[key]
          ?.toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      )
    );
  }, [contacts, searchInput]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize, // Comes from react-table
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: pageSizeState },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="მარკეტინგი" breadcrumbItem="მომხმარებლების სია" />
          <Row className="mb-3">
            <Col>
              <Button
                color="success"
                className="btn-rounded waves-effect waves-light mb-2"
                onClick={handleUserClicks}
              >
                დამატება
              </Button>
            </Col>
            <Col sm="4">
              <Input
                type="text"
                placeholder="ძებნა..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Col>
            <Col sm="4">
              <Input
                type="select"
                value={pageSizeState}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setPageSizeState(newSize); // Update the state
                  setPageSize(newSize); // Update react-table's page size
                }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    მაჩვენე {size}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>

          <Row>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <table
                      {...getTableProps()}
                      className="table align-middle table-hover dt-responsive nowrap w-100"
                    >
                      <thead className="table-light">
                        {headerGroups.map((headerGroup, index) => (
                          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column, columnIndex) => (
                              <th
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                                key={columnIndex}
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
                        {page.map((row, rowIndex) => {
                          prepareRow(row);
                          return (
                            <tr {...row.getRowProps()} key={rowIndex}>
                              {row.cells.map((cell, cellIndex) => (
                                <td {...cell.getCellProps()} key={cellIndex}>
                                  {cell.render("Cell")}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Custom Pagination */}
                    <div className="pagination d-flex justify-content-center align-items-center">
                      <Button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className="btn-sm"
                      >
                        {"<<"}
                      </Button>{" "}
                      <Button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className="btn-sm"
                      >
                        {"<"}
                      </Button>{" "}
                      <span className="mx-2">
                        Page{" "}
                        <strong>
                          {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                      </span>
                      <Button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className="btn-sm"
                      >
                        {">"}
                      </Button>{" "}
                      <Button
                        onClick={() => gotoPage(pageOptions.length - 1)}
                        disabled={!canNextPage}
                        className="btn-sm"
                      >
                        {">>"}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal} tag="h4">
              {isEdit ? "კონტაქტის რედაკტირება" : "კონტაქტის დამატება"}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                }}
              >
                <Row>
                  <Col xs={12}>
                    <div className="mb-3">
                      <Label className="form-label">სახელი</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Enter Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        invalid={validation.touched.name && validation.errors.name}
                      />
                      {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">გვარი</Label>
                      <Input
                        name="surname"
                        type="text"
                        placeholder="Enter Surname"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.surname || ""}
                        invalid={validation.touched.surname && validation.errors.surname}
                      />
                      {validation.touched.surname && validation.errors.surname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.surname}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">ელ-ფოსტა</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={validation.touched.email && validation.errors.email}
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">მობილურის ნომერი</Label>
                      <Input
                        name="mobile_number"
                        type="text"
                        placeholder="Enter Mobile Number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mobile_number || ""}
                        invalid={validation.touched.mobile_number && validation.errors.mobile_number}
                      />
                      {validation.touched.mobile_number && validation.errors.mobile_number ? (
                        <FormFeedback type="invalid">
                          {validation.errors.mobile_number}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">პირადი ნომერი</Label>
                      <Input
                        name="id_number"
                        type="text"
                        placeholder="Enter ID Number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.id_number || ""}
                        invalid={validation.touched.id_number && validation.errors.id_number}
                      />
                      {validation.touched.id_number && validation.errors.id_number ? (
                        <FormFeedback type="invalid">
                          {validation.errors.id_number}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <button type="submit" className="btn btn-success save-user">
                        დამატება
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ContactsList;
