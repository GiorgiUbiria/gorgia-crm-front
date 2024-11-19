import React, { useState } from "react"
import { Container, Row, Col, Card, CardBody, Nav, TabContent, TabPane, Label, Button, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, InputGroup } from "reactstrap"
import classnames from "classnames"
import ReactApexChart from "react-apexcharts"
import { series } from "./CryptoWallet/crypto-exchange-series"
import { orderbookData } from "common/data"

//Simple bar
import SimpleBar from "simplebar-react"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//Import Images
import avatar from "../../assets/images/users/avatar-1.jpg"

const CryptoExchange = () => {

  //meta title
  document.title = "Exchange | Gorgia LLC";

  const options = {
    chart: {
      type: 'candlestick',
      height: 310,
      toolbar: false,
      zoom: {
        enabled: true,
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#34c38f',
          downward: '#f46a6a'
        }
      }
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  }
  const notofications = [
    {
      date: "15 Mor",
      desc: "If several languages coalesce of the resulting.",
    },
    {
      date: "14 Mor",
      desc: "New common language will be more simple and regular than the existing.",
    },
    {
      date: "13 Mor",
      desc: "It will seem like simplified English as a skeptical Cambridge.",
    },
    { date: "13 Mor", desc: "To achieve this, it would be necessary." },
    { date: "12 Mor", desc: "Cum sociis natoque penatibus et magnis dis." },
    {
      date: "11 Mor",
      desc: "New common language will be more simple and regular than the existing.",
    },
    {
      date: "10 Mor",
      desc: "It will seem like simplified English as a skeptical Cambridge.",
    },
    { date: "9 Mor", desc: "To achieve this, it would be necessary." },
  ]

  const [isMenu, setIsMenu] = useState(false)
  const [activeTab, setActiveTab] = useState("1")

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const toggleMenu = () => {
    setIsMenu(!isMenu)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Crypto" breadcrumbItem="Exchange" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <img src={avatar} alt="" className="avatar-md rounded-circle img-thumbnail" />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>Henry wells</h5>
                        <p className="mb-1">henrywells@abc.com</p>
                        <p className="mb-0">Id no: #SK0234</p>
                      </div>
                    </div>
                    <Dropdown direction="left" isOpen={isMenu} toggle={toggleMenu}>
                      <DropdownToggle type="button" tag="button" className="btn btn-light">
                        <i className="mdi mdi-wallet me-2 " />
                        <span className="d-none d-sm-inline-block">
                          Wallet Balance <i className="mdi mdi-chevron-down" />
                        </span>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-md dropdown-menu-end">
                        <div className="dropdown-item-text">
                          <div>
                            <p className="text-muted mb-2">Available Balance</p>
                            <h5 className="mb-0">$ 9148.23</h5>
                          </div>
                        </div>

                        <DropdownItem divider />

                        <DropdownItem href="#!">
                          BTC : <span className="float-end">1.02356</span>
                        </DropdownItem>
                        <DropdownItem href="#!">
                          ETH : <span className="float-end">0.04121</span>
                        </DropdownItem>
                        <DropdownItem href="#!">
                          LTC : <span className="float-end">0.00356</span>
                        </DropdownItem>

                        <DropdownItem divider />

                        <DropdownItem
                          className="text-primary text-center"
                          href="#!"
                        >
                          Learn more
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl="8">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Price</h4>

                  <Row>
                    <Col xl="3" sm="4">
                      <div className="d-flex">
                        <div className="avatar-sm me-3">
                          <span className="avatar-title rounded-circle bg-warning-subtle text-warning font-size-22">
                            <i className="mdi mdi-bitcoin" />
                          </span>
                        </div>

                        <div className="flex-grow-1">
                          <p className="text-muted mb-2">Bitcoin</p>
                          <h5>1.02356 BTC</h5>
                        </div>
                      </div>
                    </Col>

                    <Col xl="3" sm="4">
                      <div className="mt-4 mt-sm-0">
                        <p className="text-muted mb-2">In USD</p>
                        <h5>6310.22 USD</h5>
                      </div>
                    </Col>

                    <Col xl="3" sm="4">
                      <div className="mt-4 mt-sm-0">
                        <p className="text-muted mb-2">Last 24 hrs</p>
                        <h5>
                          0.24 % <i className="mdi mdi-arrow-up text-success" />
                        </h5>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <ReactApexChart
                      series={series}
                      options={options}
                      type="candlestick"
                      height={310}
                      id="candlestick-chart"
                      className="apex-charts"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Buy / Sell</h4>

                  <div>
                    <p className="text-muted mb-2">
                      <i className="mdi mdi-wallet me-1" /> Wallet Balance
                    </p>
                    <h5>$ 9148.23</h5>
                  </div>

                  <div className="mt-4">
                    <Nav pills className="bg-light rounded" role="tablist">
                      <NavItem>
                        <NavLink className={classnames({ active: activeTab === "1", })} onClick={() => { toggleTab("1") }}>
                          Buy
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className={classnames({ active: activeTab === "2", })} onClick={() => { toggleTab("2") }}>
                          Sell
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent activeTab={activeTab} className="mt-4">
                      <TabPane tabId="1" id="buy-tab">
                        <h5 className="font-size-14 mb-4">Buy Coin</h5>

                        <div>
                          <div>
                            <Label>Add Amount :</Label>
                            <InputGroup className="mb-3">
                              <Label className="input-group-text">Amount</Label>
                              <select className="form-select" style={{ maxWidth: "90px" }}>
                                <option value="1" defaultValue>BTC  </option>
                                <option value="2">ETH</option>
                                <option value="3">LTC</option>
                              </select>
                              <Input type="text" className="form-control" />
                            </InputGroup>

                            <InputGroup className="mb-3">
                              <Label className="input-group-text">Price</Label>
                              <Input type="text" className="form-control" placeholder="Price" />
                              <Label className="input-group-text">$</Label>
                            </InputGroup>

                            <InputGroup className="mb-3">
                              <Label className="input-group-text">Total</Label>
                              <Input type="text" className="form-control" placeholder="Total" />
                            </InputGroup>
                          </div>

                          <div className="text-center">
                            <Button type="button" color="success" className="w-md">Buy Coin</Button>
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tabId="2" id="sell-tab">
                        <h5 className="font-size-14 mb-4">Sell Coin</h5>

                        <div>
                          <div>
                            <Label>Add Amount :</Label>
                            <InputGroup className="mb-3">
                              <Label className="input-group-text">Amount</Label>
                              <select className="form-select" style={{ maxWidth: "90px" }}>
                                <option value="1" defaultValue>BTC </option>
                                <option value="2">ETH</option>
                                <option value="3">LTC</option>
                              </select>
                              <Input type="text" className="form-control" />
                            </InputGroup>

                            <InputGroup className="mb-3">
                              <Label className="input-group-text">Price</Label>
                              <Input type="text" className="form-control" placeholder="Price" />
                              <Label className="input-group-text">$</Label>
                            </InputGroup>

                            <InputGroup className="mb-3">
                              <Label className="input-group-text">Total</Label>
                              <Input type="text" className="form-control" placeholder="Total" />
                            </InputGroup>
                          </div>

                          <div className="text-center">
                            <Button type="button" color="danger" className="w-md">Sell Coin</Button>
                          </div>
                        </div>
                      </TabPane>
                    </TabContent>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl="6">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Order book</h4>

                  <div className="table-responsive">
                    <table className="table table-bordered mb-0">
                      <thead>
                        <tr className="text-center">
                          <th colSpan="3">Buy</th>
                          <th colSpan="3">Sell</th>
                        </tr>
                        <tr>
                          <th scope="col">Amount</th>
                          <th scope="col">Total</th>
                          <th scope="col">Price</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Total</th>
                          <th scope="col">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (orderbookData || [])?.map((item, index) => (
                            <tr key={index}>
                              <td>{item.column1}</td>
                              <td>{item.column2}</td>
                              <td>{item.column3}</td>
                              <td>{item.column4}</td>
                              <td>{item.column5}</td>
                              <td>{item.column6}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="6">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Notifications</h4>

                  <SimpleBar style={{ maxHeight: "310px" }}>
                    <ul className="verti-timeline list-unstyled">
                      {(notofications || [])?.map((notification, key) => (
                        <li key={key} className="event-list">
                          <div className="event-timeline-dot">
                            <i className="bx bx-right-arrow-circle font-size-18" />
                          </div>
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <h5 className="font-size-14">
                                {notification.date}{" "}
                                <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                              </h5>
                            </div>
                            <div className="flex-grow-1">
                              <div>{notification.desc}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </SimpleBar>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CryptoExchange
