import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { connect } from "react-redux";
import withRouter from "components/Common/withRouter";

import TableContainer from "../../../components/Common/TableContainer";

// flatpickr
import "flatpickr/dist/themes/material_blue.css";
import FlatPickr from "react-flatpickr";

import "assets/scss/datatables.scss";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getCryptoOrders } from "store/crypto/actions";
import Spinners from "components/Common/Spinner";
import { handleSearchData } from "components/Common/searchFile";

const CryptoOrders = props => {

  //meta title
  document.title = "Orders | Gorgia LLC";

  const { orders, onGetOrders, loading } = props;
  const [activeTab, setActiveTab] = useState("1");
  const [startDate, setStartDate] = useState(new Date('04-03-2020'));
  const [isLoading, setLoading] = useState(loading)
  const [order, setOrder] = useState();

  useEffect(() => {
    onGetOrders();
  }, [onGetOrders]);


  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // search 
  const handleSelect = (ele) => {
    let search = ele.target.value;
    if (search === "All") {
      setOrder(orders)
    } else {
      handleSearchData({ setState: setOrder, data: orders, item: search })
    }
  };

  useEffect(() => {
    setOrder(orders)
  }, [orders])

  // Table Data
  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "pdate",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Coin",
        accessorKey: "coin",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Value",
        accessorKey: "value",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Value in USD",
        accessorKey: "valueInUsd",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          switch (cellProps.row.original.status) {
            case "Completed":
              return <Badge className="bg-success font-size-10">Completed</Badge>
            case "Pending":
              return <Badge className="bg-warning font-size-10">Pending</Badge>
            case "Failed":
              return <Badge className="bg-danger font-size-10">Failed</Badge>
          }
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Crypto" breadcrumbItem="Orders" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-3">Orders</h4>
                  {
                    isLoading ? <Spinners setLoading={setLoading} />
                      :
                      <>
                        <ul className="nav nav-tabs nav-tabs-custom" role="tablist">
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: activeTab === "1",
                              })}
                              onClick={() => {
                                toggleTab("1");
                              }}
                            >
                              All Orders
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: activeTab === "2",
                              })}
                              onClick={() => {
                                toggleTab("2");
                              }}
                            >
                              Processing
                            </NavLink>
                          </NavItem>
                        </ul>

                        <TabContent activeTab={activeTab} className="p-3">
                          <TabPane tabId="1" id="all-order">
                            <Form>
                              <Row className="mb-4">
                                <Col sm={6} className="col-xl">
                                  <FormGroup className="mb-3">
                                    <Label className="form-label">Date :</Label>
                                    <FlatPickr
                                      className="form-control"
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                      name="joiningDate"
                                      placeholder="Select time"
                                      options={{
                                        dateFormat: "d M, Y"
                                      }}
                                    />
                                  </FormGroup>
                                </Col>

                                <Col sm={6} className="col-xl">
                                  <FormGroup className="mb-3">
                                    <Label className="form-label">Coin</Label>
                                    <select className="form-control select2-search-disable" onChange={(e) => handleSelect(e)}>
                                      <option defaultValue="all">All </option>
                                      <option value="Bitcoin">Bitcoin</option>
                                      <option value="Ethereum">Ethereum</option>
                                      <option value="Litecoin">Litecoin</option>
                                    </select>
                                  </FormGroup>
                                </Col>

                                <Col sm={6} className="col-xl">
                                  <FormGroup className="mb-3">
                                    <Label className="form-label">Type</Label>
                                    <select className="form-control select2-search-disable" onChange={(e) => handleSelect(e)}>
                                      <option defaultValue="all">All </option>
                                      <option value="Buy">Buy  </option>
                                      <option value="Sell">Sell</option>
                                    </select>
                                  </FormGroup>
                                </Col>

                                <Col sm={6} className="col-xl">
                                  <FormGroup className="mb-3">
                                    <Label className="form-label">Status</Label>
                                    <select className="form-control select2-search-disable" onChange={(e) => handleSelect(e)}>
                                      <option defaultValue="all">All </option>
                                      <option value="Completed">Completed</option>
                                      <option value="Pending">Pending</option>
                                    </select>
                                  </FormGroup>
                                </Col>

                                <Col sm={6} className="col-xl align-self-end">
                                  <div className="mb-3">
                                    <Button
                                      type="button"
                                      color="primary"
                                      className="w-md"
                                    >
                                      Filter
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Form>

                            <TableContainer
                              columns={columns}
                              data={order || []}
                              isCustomPageSize={true}
                              isPagination={true}
                              isGlobalFilter={true}
                              SearchPlaceholder="24 record.."
                              paginationWrapper="dataTables_paginate paging_simple_numbers"
                              pagination="pagination"
                              tableClass="table-hover table-nowrap datatable dt-responsive nowrap dataTable no-footer dtr-inline"
                            />

                          </TabPane>
                          <TabPane tabId="2" id="processing">
                            <div>
                              <TableContainer
                                columns={columns}
                                data={order || []}
                                isCustomPageSize={true}
                                isPagination={true}
                                isGlobalFilter={true}
                                pagination="pagination"
                                SearchPlaceholder="24 record.."
                                paginationWrapper="dataTables_paginate paging_simple_numbers"
                                tableClass="table-hover table-nowrap datatable dt-responsive nowrap dataTable no-footer dtr-inline"
                              />
                            </div>
                          </TabPane>
                        </TabContent>
                      </>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

CryptoOrders.propTypes = {
  orders: PropTypes.array,
  onGetOrders: PropTypes.func,
};

const mapStateToProps = ({ crypto }) => ({
  orders: crypto.orders,
  loading: crypto.loading
});

const mapDispatchToProps = dispatch => ({
  onGetOrders: () => dispatch(getCryptoOrders()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CryptoOrders));
