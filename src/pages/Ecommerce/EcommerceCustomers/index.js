import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Card, CardBody, Col, Container, Row, Modal, ModalHeader, ModalBody, UncontrolledTooltip, Input, FormFeedback, Label, Form, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";

import "flatpickr/dist/themes/material_blue.css";
import FlatPickr from "react-flatpickr";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import DeleteModal from "../../../components/Common/DeleteModal";
import {
  getCustomers as onGetCustomers,
  addNewCustomer as onAddNewCustomer,
  updateCustomer as onUpdateCustomer,
  deleteCustomer as onDeleteCustomer,
} from "store/e-commerce/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import TableContainer from '../../../components/Common/TableContainer'

import moment from "moment";
import { PatternFormat } from "react-number-format";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";

const EcommerceCustomers = () => {

  //meta title
  document.title = "Customers | Gorgia LLC";

  const dispatch = useDispatch();

  const EcommerenceCustomerProperties = createSelector(
    (state) => state.ecommerce,
    (Ecommerce) => ({
      customers: Ecommerce.customers,
      loading: Ecommerce.loading
    })
  );

  const {
    customers, loading
  } = useSelector(EcommerenceCustomerProperties);

  const [isLoading, setLoading] = useState(loading)

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState(null);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: (customer && customer.username) || '',
      phone: (customer && customer.phone) || '',
      email: (customer && customer.email) || '',
      address: (customer && customer.address) || '',
      rating: (customer && customer.rating) || '',
      walletBalance: (customer && customer.walletBalance) || '',
      joiningDate: (customer && customer.joiningDate) || '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your Name"),
      phone: Yup.string().required("Please Enter Your Phone"),
      email: Yup.string().matches(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please Enter Valid Email"
      ).required("Please Enter Your Email"),
      address: Yup.string().required("Please Enter Your Address"),
      rating: Yup.string().matches(
        /\b([0-9]|10)\b/,
        "Please Enter Valid Rating"
      ).required("Please Enter Your Rating"),
      walletBalance: Yup.string().required("Please Enter Your Wallet Balance"),
      joiningDate: Yup.string().required("Please Enter Your Joining Date"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCustomer = {
          id: customer ? customer.id : 0,
          username: values.username,
          phone: values.phone,
          email: values.email,
          address: values.address,
          rating: values.rating,
          walletBalance: values.walletBalance,
          joiningDate: values.joiningDate,
        };
        // update customer
        dispatch(onUpdateCustomer(updateCustomer));
        validation.resetForm();
      } else {
        const newCustomer = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          username: values["username"],
          phone: values["phone"],
          email: values["email"],
          address: values["address"],
          rating: values["rating"],
          walletBalance: values["walletBalance"],
          joiningDate: values["joiningDate"],
        };
        // save new customer
        dispatch(onAddNewCustomer(newCustomer));
        validation.resetForm();
      }
      toggle();
    },
  });

  const handleCustomerClick = arg => {
    const customer = arg;

    setCustomer({
      id: customer.id,
      username: customer.username,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      rating: customer.rating,
      walletBalance: customer.walletBalance,
      joiningDate: customer.joiningDate,
    });

    setIsEdit(true);
    toggle();
  };

  // Customber Column
  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "id",
        cell: () => {
          return <input type="checkbox" className="form-check-input" />;
        },
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Username",
        accessorKey: "username",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => {
          return (
            <>
              <p className="mb-0">{cell.row.original.email}</p>
            </>
          );
        },
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Rating",
        accessorKey: "rating",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span className="badge bg-success font-size-12"><i className="mdi mdi-star me-1"></i> {cellProps.getValue()}</span>
        }
      },
      {
        header: "Wallet Balances",
        accessorKey: "walletBalance",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Joining Date",
        accessorKey: "joiningDate",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle tag="a" className="card-drop">
                <i className="mdi mdi-dots-horizontal font-size-18"></i>
              </DropdownToggle>

              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  onClick={() => {
                    const customerData = cellProps.row.original;
                    handleCustomerClick(customerData);
                  }
                  }
                >
                  <i className="mdi mdi-pencil font-size-16 text-success me-1" id="edittooltip"></i>
                  Edit
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    const customerData = cellProps.row.original;
                    onClickDelete(customerData);
                  }}>
                  <i className="mdi mdi-trash-can font-size-16 text-danger me-1" id="deletetooltip"></i>
                  Delete
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        }
      },
    ],
    []
  );

  const toggle = () => {
    if (modal) {
      setModal(false);
      setCustomer(null);
    } else {
      setModal(true);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (customer) => {
    setCustomer(customer);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = () => {
    if (customer && customer.id) {
      dispatch(onDeleteCustomer(customer.id));
      setDeleteModal(false);
      setCustomer(null)
    }
  };

  useEffect(() => {
    if (customers && !customers.length) {
      dispatch(onGetCustomers());
    }
  }, [dispatch, customers]);

  const handleCustomerClicks = () => {
    setIsEdit(false);
    setCustomer("");
    toggle();
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCustomer}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Customers" />
          <Row>
            {
              isLoading ? <Spinners setLoading={setLoading} />
                :
                <Col xs="12">
                  <Card>
                    <CardBody>
                      <TableContainer
                        columns={columns}
                        data={customers}
                        isGlobalFilter={true}
                        isAddButton={true}
                        isPagination={true}
                        isCustomPageSize={true}
                        handleUserClick={handleCustomerClicks}
                        buttonClass="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2 addCustomers-modal"
                        buttonName=" New Customers"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        pagination="pagination"
                        SearchPlaceholder="search..."
                      />
                    </CardBody>
                  </Card>
                </Col>
            }
          </Row>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit
                ? "Edit Customer"
                : "Add Customer"}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label>UserName</Label>
                      <Input
                        name="username"
                        type="text"
                        placeholder="Insert User Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.username || ""}
                        invalid={
                          validation.touched.username && validation.errors.username ? true : false
                        }
                      />
                      {validation.touched.username && validation.errors.username ? (
                        <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Phone No</Label>
                      <PatternFormat
                        className="form-control"
                        name="phone"
                        placeholder="Insert Phone No"
                        value={validation.values.phone || ""}
                        onChange={validation.handleChange}
                        format="###-###-####"
                      />

                      {validation.touched.phone && validation.errors.phone ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.phone}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Email Id</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Insert Email Id"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email ? true : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Address</Label>
                      <Input
                        name="address"
                        type="textarea"
                        placeholder="Insert Address"
                        rows="3"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.address || ""}
                        invalid={
                          validation.touched.address && validation.errors.address ? true : false
                        }
                      />
                      {validation.touched.address && validation.errors.address ? (
                        <FormFeedback type="invalid">{validation.errors.address}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Rating</Label>
                      <Input
                        name="rating"
                        type="text"
                        placeholder="Insert Rating"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.rating || ""}
                        invalid={
                          validation.touched.rating && validation.errors.rating ? true : false
                        }
                      />
                      {validation.touched.rating && validation.errors.rating ? (
                        <FormFeedback type="invalid">{validation.errors.rating}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Wallet Balance</Label>
                      <Input
                        name="walletBalance"
                        type="text"
                        placeholder="Insert Wallet Balance"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.walletBalance || ""}
                        invalid={
                          validation.touched.walletBalance && validation.errors.walletBalance ? true : false
                        }
                      />
                      {validation.touched.walletBalance && validation.errors.walletBalance ? (
                        <FormFeedback type="invalid">{validation.errors.walletBalance}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Joining Date</Label>
                      <FlatPickr
                        className="form-control"
                        name="joiningDate"
                        placeholder="Select time"
                        value={validation.values.joiningDate || ""}
                        options={{
                          dateFormat: "d M, Y"
                        }}
                        onChange={(date) => validation.setFieldValue("joiningDate", moment(date[0]).format("DD MMM ,YYYY"))}
                      />
                      {validation.touched.joiningDate && validation.errors.joiningDate ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.joiningDate}</FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <Button color="success"
                        type="submit"
                        className="save-customer"
                      >
                        Save
                      </Button>
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

EcommerceCustomers.propTypes = {
  customers: PropTypes.array,
  onGetCustomers: PropTypes.func,
  onAddNewCustomer: PropTypes.func,
  onDeleteCustomer: PropTypes.func,
  onUpdateCustomer: PropTypes.func,
};

export default EcommerceCustomers;
