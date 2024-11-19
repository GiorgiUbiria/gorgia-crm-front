import React, { useState } from "react"
import {
  Col,
  Card,
  Nav,
  CardBody,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
} from "reactstrap"
import classnames from "classnames"

//Simple bar
import SimpleBar from "simplebar-react"
import { transactionsDataALL, transactionsDataBuy, transactionsDataSell } from "common/data"

const Transactions = () => {
  const [activeTab, setactiveTab] = useState("1")

  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Transactions</h4>

            <Nav pills className="bg-light rounded" role="tablist">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    setactiveTab("1")
                  }}
                >
                  All
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    setactiveTab("2")
                  }}
                >
                  Buy
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "3" })}
                  onClick={() => {
                    setactiveTab("3")
                  }}
                >
                  Sell
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="mt-4">
              <TabPane tabId="1">
                <SimpleBar style={{ maxHeight: "330px" }}>
                  <div className="table-responsive">
                    <Table className="table align-middle table-nowrap">
                      <tbody>
                        {
                          (transactionsDataALL || []).map((item, index) => (
                            <tr key={index}>
                              <td style={{ width: "50px" }}>
                                <div className={`font-size-22 text-${item.color}`}>
                                  <i className={`bx ${item.icon}`} />
                                </div>
                              </td>

                              <td>
                                <div>
                                  <h5 className="font-size-14 mb-1">{item.type} {item.currency}</h5>
                                  <p className="text-muted mb-0">{item.date}</p>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 mb-0">{item.amount}</h5>
                                </div>
                              </td>

                              <td>
                                <div className="text-end">
                                  <h5 className="font-size-14 text-muted mb-0">
                                    {item.price}
                                  </h5>
                                </div>
                              </td>
                            </tr>
                          ))
                        }

                      </tbody>
                    </Table>
                  </div>
                </SimpleBar>
              </TabPane>
              <TabPane tabId="2">
                <SimpleBar style={{ maxHeight: "330px" }}>
                  <div className="table-responsive">
                    <Table className="table align-middle table-nowrap">
                      <tbody>

                        {(transactionsDataBuy || []).map((transaction, index) => (
                          <tr key={index}>
                            <td style={{ width: '50px' }}>
                              <div className={`font-size-22 text-${transaction.color}`}>
                                <i className={`bx ${transaction.icon}`} />
                              </div>
                            </td>
                            <td>
                              <div>
                                <h5 className="font-size-14 mb-1">{transaction.type} {transaction.currency}</h5>
                                <p className="text-muted mb-0">{transaction.date}</p>
                              </div>
                            </td>
                            <td>
                              <div className="text-end">
                                <h5 className="font-size-14 mb-0">{transaction.amount}</h5>
                              </div>
                            </td>
                            <td>
                              <div className="text-end">
                                <h5 className="font-size-14 text-muted mb-0">{transaction.price}</h5>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </SimpleBar>
              </TabPane>

              <TabPane tabId="3">
                <SimpleBar style={{ maxHeight: "330px" }}>
                  <div className="table-responsive">
                    <Table className="table align-middle table-nowrap">
                      <tbody>
                        {(transactionsDataSell || []).map((transaction, index) => (
                          <tr key={index}>
                            <td style={{ width: "50px" }}>
                              <div className={`font-size-22 text-${transaction.color}`}>
                                <i className={`bx ${transaction.icon}`}></i>
                              </div>
                            </td>

                            <td>
                              <div>
                                <h5 className="font-size-14 mb-1">{transaction.type} {transaction.currency}</h5>
                                <p className="text-muted mb-0">{transaction.date}</p>
                              </div>
                            </td>

                            <td>
                              <div className="text-end">
                                <h5 className="font-size-14 mb-0">{transaction.amount}</h5>
                              </div>
                            </td>

                            <td>
                              <div className="text-end">
                                <h5 className="font-size-14 text-muted mb-0">{transaction.price}</h5>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </SimpleBar>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default Transactions
