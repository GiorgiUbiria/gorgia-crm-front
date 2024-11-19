import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Col, Row, Card, CardBody, CardTitle, Container } from "reactstrap";
import {
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiButtons = () => {

  //meta title
  document.title = "Buttons | Gorgia LLC";

  const [drp_link, setdrp_link] = useState(false);

  const buttonStyle = {
    '--bs-focus-ring-color': 'rgba(var(--bs-success-rgb), .25)',
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Buttons" />

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Default buttons</CardTitle>
                  <p className="card-title-desc">
                    Bootstrap includes six predefined button styles, each
                    serving its own semantic purpose.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button color="primary" className="btn btn-primary waves-effect waves-light">Primary</Button>
                    <Button color="secondary" className="btn btn-secondary waves-effect waves-light">Secondary</Button>
                    <Button color="success" className="btn btn-success waves-effect waves-light">Success</Button>
                    <Button color="info" className="btn btn-info waves-effect waves-light">Info</Button>
                    <Button color="warning" className="btn btn-warning waves-effect waves-light">Warning</Button>
                    <Button color="danger" className="btn btn-danger waves-effect waves-light">Danger</Button>
                    <Button color="dark" className="btn btn-dark waves-effect waves-light">Dark</Button>
                    <Button color="link" className="btn btn-link waves-effect">Link</Button>
                    <Button color="light" className="btn btn-light waves-effect">Light</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Outline buttons</CardTitle>
                  <p className="card-title-desc">
                    Replace the default modifier classes with the{" "}
                    <code className="highlighter-rouge">.btn-outline-*</code>{" "}
                    ones to remove all background images and colors on any
                    button.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button color="primary" outline>Primary</Button>
                    <Button color="secondary" outline>Secondary</Button>
                    <Button color="success" outline>Success</Button>
                    <Button color="info" outline>Info</Button>
                    <Button color="warning" outline>Warning</Button>
                    <Button color="danger" outline>Danger</Button>
                    <Button color="dark" outline>Dark</Button>
                    <Button color="light" outline >Light</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="card-title">Soft Buttons</CardTitle>
                  <p className="card-title-desc">Use class <code>.btn-soft*</code> for soft buttons.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" className="btn btn-soft-primary waves-effect waves-light">Primary</Button>
                    <Button type="button" className="btn btn-soft-secondary waves-effect waves-light">Secondary</Button>
                    <Button type="button" className="btn btn-soft-success waves-effect waves-light">Success</Button>
                    <Button type="button" className="btn btn-soft-info waves-effect waves-light">Info</Button>
                    <Button type="button" className="btn btn-soft-warning waves-effect waves-light">Warning</Button>
                    <Button type="button" className="btn btn-soft-danger waves-effect waves-light">Danger</Button>
                    <Button type="button" className="btn btn-soft-dark waves-effect waves-light">Dark</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Rounded buttons</CardTitle>
                  <p className="card-title-desc">
                    Use class <code>.btn-rounded</code> for button round border.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button color="primary" className="btn-rounded ">Primary</Button>
                    <Button color="secondary" className="btn-rounded ">Secondary</Button>
                    <Button color="success" className="btn-rounded ">Success</Button>
                    <Button color="info" className="btn-rounded ">Info</Button>
                    <Button color="warning" className="btn-rounded ">Warning</Button>
                    <Button color="danger" className="btn-rounded ">Danger</Button>
                    <Button color="dark" className="btn-rounded ">Dark</Button>
                    <Button color="link" className="btn-rounded">Link</Button>
                    <Button color="light" className="btn-rounded">Light</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Buttons with icon</CardTitle>
                  <p className="card-title-desc">Add icon in button.</p>

                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" color="primary">
                      <i className="bx bx-smile font-size-16 align-middle me-2"></i>{" "}
                      Primary
                    </Button>
                    <Button type="button" color="success">
                      <i className="bx bx-check-double font-size-16 align-middle me-2"></i>{" "}
                      Success
                    </Button>
                    <Button type="button" color="warning">
                      <i className="bx bx-error font-size-16 align-middle me-2"></i>{" "}
                      Warning
                    </Button>
                    <Button type="button" color="danger">
                      <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                      Danger
                    </Button>
                    <Button type="button" color="dark">
                      <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>{" "}
                      Loading
                    </Button>
                    <Button type="button" color="light">
                      <i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2"></i>{" "}
                      Loading
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle>Snip Buttons</CardTitle>

                  <Row>
                    <Col xl={4}>
                      <div className="mt-4">
                        <h5 className="font-size-15 mb-3">Example 1</h5>

                        <div>
                          <div
                            className="btn-group btn-group-example mb-3"
                            role="group"
                          >
                            <Button type="button" color="outline-primary" className="w-sm">Left</Button>
                            <Button type="button" color="outline-primary" className="w-sm">Middle</Button>
                            <Button type="button" color="outline-primary" className="w-sm">Right</Button>
                          </div>

                          <div>
                            <div
                              className="btn-group btn-group-example mb-3"
                              role="group"
                            >
                              <Button type="button" color="primary" className="w-xs">
                                <i className="mdi mdi-thumb-up"></i>
                              </Button>
                              <Button type="button" color="danger" className="w-xs">
                                <i className="mdi mdi-thumb-down"></i>
                              </Button>
                            </div>
                          </div>

                          <div>
                            <div
                              className="btn-group btn-group-example"
                              role="group"
                            >
                              <Button type="button" color="outline-secondary" className="w-xs">
                                <i className="bx bx-menu-alt-right"></i>
                              </Button>
                              <Button type="button" color="outline-secondary" className="w-xs">
                                <i className="bx bx-menu"></i>
                              </Button>
                              <Button type="button" color="outline-secondary" className="w-xs">
                                <i className="bx bx-menu-alt-left"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <div className="col-lg-4">
                      <div className="mt-4">
                        <h5 className="font-size-15 mb-3">Example 2</h5>

                        <div className="d-flex flex-wrap gap-2">
                          <Button type="button" color="primary" className="btn-label">
                            <i className="bx bx-smile label-icon"></i> Primary
                          </Button>
                          <Button type="button" color="success" className="btn-label">
                            <i className="bx bx-check-double label-icon"></i>{" "}
                            Success
                          </Button>
                          <Button type="button" color="warning" className="btn-label">
                            <i className="bx bx-error label-icon "></i> Warning
                          </Button>
                          <Button type="button" color="danger" className="btn-label">
                            <i className="bx bx-block label-icon "></i> Danger
                          </Button>
                          <Button type="button" color="dark" className="btn-label">
                            <i className="bx bx-loader label-icon "></i> Dark
                          </Button>
                          <Button type="button" color="light" className="btn-label">
                            <i className="bx bx-hourglass label-icon "></i>{" "}
                            Light
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="mt-4">
                        <h5 className="font-size-15 mb-3">Example 3</h5>

                        <div className="d-flex flex-wrap gap-2">
                          <Button type="button" color="primary" className="w-sm">
                            <i className="mdi mdi-download d-block font-size-16"></i>{" "}
                            Download
                          </Button>
                          <Button type="button" color="light" className="w-sm">
                            <i className="mdi mdi-upload d-block font-size-16"></i>{" "}
                            Upload
                          </Button>
                          <Button type="button" color="success" className="w-sm">
                            <i className="mdi mdi-pencil d-block font-size-16"></i>{" "}
                            Edit
                          </Button>
                          <Button type="button" color="danger" className="w-sm">
                            <i className="mdi mdi-trash-can d-block font-size-16"></i>{" "}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Buttons Sizes</CardTitle>
                  <p className="card-title-desc">
                    Add <code>.btn-lg</code> or <code>.btn-sm</code> for
                    additional sizes.
                  </p>

                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <Button color="primary" className="btn btn-lg ">Large button</Button>
                    <Button color="secondary" className="btn btn-lg ">Large button</Button>
                    <Button color="primary" className="btn-sm">Small button</Button>
                    <Button color="secondary" className=" btn-sm ">Small button</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Buttons width</CardTitle>
                  <p className="card-title-desc">
                    Add <code>.w-xs</code>, <code>.w-sm</code>,{" "}
                    <code>.w-md</code> and <code> .w-lg</code> className for
                    additional buttons width.
                  </p>

                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" color="primary" className="w-xs ">Xs</Button>
                    <Button type="button" color="danger" className="w-sm ">Small</Button>
                    <Button type="button" color="warning" className="w-md ">Medium</Button>
                    <Button type="button" color="success" className="w-lg ">Large</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Button tags</CardTitle>
                  <p className="card-title-desc">
                    The <code className="highlighter-rouge">.btn</code>
                    classes are designed to be used with the{" "}
                    <code className="highlighter-rouge">
                      &lt;button&gt;
                    </code>{" "}
                    element. However, you can also use these classes on{" "}
                    <code className="highlighter-rouge">&lt;Link&gt;</code> or{" "}
                    <code className="highlighter-rouge">&lt;input&gt;</code>{" "}
                    elements (though some browsers may apply a slightly
                    different rendering).
                  </p>

                  <div className="d-flex flex-wrap gap-2">
                    <Link
                      className="btn btn-primary "
                      to="#"
                      role="button"
                    >
                      Link
                    </Link>
                    <Button
                      color="success"
                      className="btn btn-success "
                      type="submit"
                    >
                      Button
                    </Button>
                    <input
                      className="btn btn-info"
                      type="button"
                      value="Input"
                    />
                    <input
                      className="btn btn-danger"
                      type="submit"
                      value="Submit"
                    />
                    <input
                      className="btn btn-warning"
                      type="reset"
                      value="Reset"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Toggle states</CardTitle>
                  <p className="card-title-desc">
                    Add{" "}
                    <code className="highlighter-rouge">
                      data-toggle=&quot;button&ldquo;
                    </code>
                    to toggle a button’s{" "}
                    <code className="highlighter-rouge">active</code>
                    state. If you’re pre-toggling a button, you must manually
                    add the <code className="highlighter-rouge">
                      .active
                    </code>{" "}
                    class
                    <strong>and</strong>{" "}
                    <code className="highlighter-rouge">
                      aria-pressed=&quot;true&ldquo;
                    </code>{" "}
                    to the
                    <code className="highlighter-rouge">&lt;button&gt;</code>.
                  </p>

                  <div className="d-flex flex-wrap gap-2">
                    <Button color="primary" className="btn btn-primary " data-toggle="button" aria-pressed="false">Single toggle</Button>
                    <Button type="button" color="primary" className="active">Active toggle button</Button>
                    <Button type="button" color="primary" disabled>Disabled toggle button</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Block Buttons</CardTitle>
                  <p className="card-title-desc">
                    Create block level buttons—those that span the full width of
                    a parent—by adding{" "}
                    <code className="highlighter-rouge">.btn-block</code>.
                  </p>

                  <div className="d-grid gap-2">
                    <Button color="primary" type="button" className="btn-lg">Block level button</Button>
                    <Button color="secondary" type="button" className="btn-sm">Block level button</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Checkbox & Radio Buttons</CardTitle>
                  <p className="card-title-desc">
                    Bootstrap’s{" "}
                    <code className="highlighter-rouge">.button</code> styles
                    can be applied to other elements, such as{" "}
                    <code className="highlighter-rouge">&lt;label&gt;</code>s,
                    to provide checkbox or radio style button toggling. Add{" "}
                    <code className="highlighter-rouge">
                      data-toggle=&quot;buttons&ldquo;
                    </code>{" "}
                    to a<code className="highlighter-rouge">.btn-group</code>{" "}
                    containing those modified buttons to enable toggling in
                    their respective styles.
                  </p>

                  <div className="d-flex flex-wrap gap-2">
                    <div>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="btn-group" role="group">
                          <input type="checkbox" className="btn-check" id="btncheck1" autoComplete="off" defaultChecked />
                          <label className="btn btn-primary" htmlFor="btncheck1">Checkbox 1</label>

                          <input type="checkbox" className="btn-check" id="btncheck2" autoComplete="off" />
                          <label className="btn btn-primary" htmlFor="btncheck2">Checkbox 2</label>

                          <input type="checkbox" className="btn-check" id="btncheck3" autoComplete="off" />
                          <label className="btn btn-primary" htmlFor="btncheck3">Checkbox 3</label>
                        </div>

                        <div className="btn-group" role="group">
                          <input type="checkbox" className="btn-check" id="btncheck4" autoComplete="off" defaultChecked />
                          <label className="btn btn-outline-primary" htmlFor="btncheck4">Checkbox 4</label>

                          <input type="checkbox" className="btn-check" id="btncheck5" autoComplete="off" />
                          <label className="btn btn-outline-primary" htmlFor="btncheck5">Checkbox 5</label>

                          <input type="checkbox" className="btn-check" id="btncheck6" autoComplete="off" />
                          <label className="btn btn-outline-primary" htmlFor="btncheck6">Checkbox 6</label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="btn-group" role="group">
                          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
                          <label className="btn btn-secondary" htmlFor="btnradio1">Radio 1</label>

                          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                          <label className="btn btn-secondary" htmlFor="btnradio2">Radio 2</label>

                          <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
                          <label className="btn btn-secondary" htmlFor="btnradio3">Radio 3</label>
                        </div>

                        <div className="btn-group" role="group">
                          <input type="radio" className="btn-check" name="btnradio" id="btnradio4" autoComplete="off" defaultChecked />
                          <label className="btn btn-outline-secondary" htmlFor="btnradio4">Radio 4</label>

                          <input type="radio" className="btn-check" name="btnradio" id="btnradio5" autoComplete="off" />
                          <label className="btn btn-outline-secondary" htmlFor="btnradio5">Radio 5</label>

                          <input type="radio" className="btn-check" name="btnradio" id="btnradio6" autoComplete="off" />
                          <label className="btn btn-outline-secondary" htmlFor="btnradio6">Radio 6</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Button group</CardTitle>
                  <p className="card-title-desc">
                    Wrap a series of buttons with{" "}
                    <code className="highlighter-rouge">.btn</code> in{" "}
                    <code className="highlighter-rouge">.btn-group</code>.
                  </p>

                  <Row>
                    <Col md={6}>
                      <div className="d-flex flex-wrap gap-2">
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Basic example"
                        >
                          <Button color="primary">Left</Button>
                          <Button color="primary">Middle</Button>
                          <Button color="primary">Right</Button>
                        </div>

                        <div className="btn-group">
                          <Link to="#" className="btn btn-outline-primary active">Left</Link>
                          <Link to="#" className="btn btn-outline-primary">Middle</Link>
                          <Link to="#" className="btn btn-outline-primary">Right</Link>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="d-flex flex-wrap gap-3 mt-4 mt-md-0">
                        <div className="btn-group">
                          <Button color="secondary" type="button"><i className="bx bx-menu-alt-right"></i></Button>
                          <Button color="secondary" type="button"><i className="bx bx-menu"></i></Button>
                          <Button color="secondary" type="button"><i className="bx bx-menu-alt-left"></i></Button>
                        </div>

                        <div className="btn-group">
                          <Button type="button" color="outline-secondary"><i className="bx bx-menu-alt-right"></i></Button>
                          <Button type="button" color="outline-secondary"><i className="bx bx-menu"></i></Button>
                          <Button type="button" color="outline-secondary"><i className="bx bx-menu-alt-left"></i></Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Button toolbar</CardTitle>
                  <p className="card-title-desc">
                    Combine sets of button groups into button toolbars for more
                    complex components.Use utility className as needed to
                    space out groups, buttons, and more.
                  </p>
                  <div className="d-flex flex-wrap gap-4">
                    <div
                      className="btn-toolbar"
                      role="toolbar"
                      aria-label="Toolbar with button groups"
                    >
                      <div className="btn-group me-2" role="group" aria-label="First group">
                        <Button color="secondary" className="btn btn-secondary">1</Button>
                        <Button color="secondary" className="btn btn-secondary">2</Button>
                        <Button color="secondary" className="btn btn-secondary">3</Button>
                        <Button color="secondary" className="btn btn-secondary">4</Button>
                      </div>
                      <div className="btn-group me-2" role="group" aria-label="Second group">
                        <Button color="secondary" className="btn btn-secondary">5</Button>
                        <Button color="secondary" className="btn btn-secondary">6</Button>
                        <Button color="secondary" className="btn btn-secondary">7</Button>
                      </div>
                      <div className="btn-group" role="group" aria-label="Third group">
                        <Button color="secondary" className="btn btn-secondary">8</Button>
                      </div>
                    </div>

                    <div className="btn-toolbar">
                      <div className="btn-group me-2">
                        <Button type="button" color="outline-secondary">1</Button>
                        <Button type="button" color="outline-secondary">2</Button>
                        <Button type="button" color="outline-secondary">3</Button>
                        <Button type="button" color="outline-secondary">4</Button>
                      </div>
                      <div className="btn-group me-2">
                        <Button type="button" color="outline-secondary">5</Button>
                        <Button type="button" color="outline-secondary">6</Button>
                        <Button type="button" color="outline-secondary">7</Button>
                      </div>
                      <div className="btn-group">
                        <Button type="button" color="outline-secondary">8</Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Sizing</CardTitle>
                  <p className="card-title-desc">
                    Instead of applying button sizing classes to every button in
                    a group, just add{" "}
                    <code className="highlighter-rouge">.btn-group-*</code> to
                    each <code className="highlighter-rouge">.btn-group</code>,
                    including each one when nesting multiple groups.
                  </p>
                  <div className="d-flex flex-wrap gap-3">
                    <div className="btn-group btn-group-lg">
                      <Button type="button" color="primary">Left</Button>
                      <Button type="button" color="primary">Middle</Button>
                      <Button type="button" color="primary">Right</Button>
                    </div>

                    <div className="btn-group btn-group-lg">
                      <Button type="button" color="outline-primary">Left</Button>
                      <Button type="button" color="outline-primary">Middle</Button>
                      <Button type="button" color="outline-primary">Right</Button>
                    </div>
                  </div>

                  <br />

                  <div className="d-flex flex-wrap gap-3">
                    <div className="btn-group">
                      <Button type="button" color="secondary">Left</Button>
                      <Button type="button" color="secondary">Middle</Button>
                      <Button type="button" color="secondary">Right</Button>
                    </div>
                    <div className="btn-group">
                      <Button type="button" color="outline-secondary">Left</Button>
                      <Button type="button" color="outline-secondary">Middle</Button>
                      <Button type="button" color="outline-secondary">Right</Button>
                    </div>
                  </div>

                  <br />

                  <div className="d-flex flex-wrap gap-3">
                    <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                      <Button type="button" color="danger">Left</Button>
                      <Button type="button" color="danger">Middle</Button>
                      <Button type="button" color="danger">Right</Button>
                    </div>

                    <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                      <Button type="button" color="outline-danger">Left</Button>
                      <Button type="button" color="outline-danger">Middle</Button>
                      <Button type="button" color="outline-danger">Right</Button>
                    </div>
                  </div>

                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Vertical variation</CardTitle>
                  <p className="card-title-desc">
                    Make a set of buttons appear vertically stacked rather than
                    horizontally.Split button dropdowns are not supported here.
                  </p>
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                      <Button type="button" color="secondary">Button</Button>

                      <ButtonDropdown isOpen={drp_link} toggle={() => { setdrp_link(!drp_link); }}>
                        <DropdownToggle caret color="secondary">
                          Dropdown <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Dropdown link</DropdownItem>
                          <DropdownItem>Dropdown link</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>

                      <Button color="secondary" type="button">Button</Button>
                      <Button color="secondary" type="button">Button</Button>
                    </div>

                    <div className="btn-group-vertical">
                      <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio1" autoComplete="off" defaultChecked />
                      <label className="btn btn-outline-danger" htmlFor="vbtn-radio1">Radio 1</label>
                      <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio2" autoComplete="off" />
                      <label className="btn btn-outline-danger" htmlFor="vbtn-radio2">Radio 2</label>
                      <input type="radio" className="btn-check" name="vbtn-radio" id="vbtn-radio3" autoComplete="off" />
                      <label className="btn btn-outline-danger" htmlFor="vbtn-radio3">Radio 3</label>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>

                  <h4 className="card-title">Base class</h4>
                  <p className="card-title-desc">Bootstrap has a base <code>.btn</code> class that sets up basic styles such as padding and content alignment. By default, <code>.btn</code> controls have a transparent border and background color, and lack any explicit focus and hover styles.</p>

                  <button type="button" className="btn">Base class</button>

                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title">Custom sizing with CSS variables</h4>
                  <p className="card-title-desc">You can even roll your own custom sizing with CSS variables:</p>
                  <div>
                    <Button type="button" color="primary"
                    //  style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                    >
                      Custom button
                    </Button>
                  </div>

                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Focus ring</CardTitle>
                  <p className="card-title-desc">Click directly on the link below to see the focus ring in action, or into the example below and then press <kbd>Tab</kbd>.</p>
                  <div>
                    <Link to="#!" className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2">
                      Custom focus ring
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>CSS variables</CardTitle>
                  <p className="card-title-desc">Modify the <code>--bs-focus-ring-*</code> CSS variables as needed to change the default appearance.</p>
                  <div>
                    <Link to="#!" className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2" style={buttonStyle}>
                      Green focus ring
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle>Sass utilities API</CardTitle>
                  <p className="card-title-desc">In addition to <code>.focus-ring</code>, we have several <code>.focus-ring-*</code> utilities to modify the helper class defaults. Modify the color with any of our <a href="https://getbootstrap.com/docs/5.3/customize/color/#theme-colors">theme colors</a>. Note that the light and dark variants may not be visible on all background colors given current color mode support.</p>
                  <Row>
                    <Col xl={6}>
                      <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-primary py-1 px-2 text-decoration-none border rounded-2">Primary focus</Link></p>
                      <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-secondary py-1 px-2 text-decoration-none border rounded-2">Secondary focus</Link></p>
                      <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-success py-1 px-2 text-decoration-none border rounded-2">Success focus</Link></p>
                      <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-danger py-1 px-2 text-decoration-none border rounded-2">Danger focus</Link></p>
                    </Col>
                    <Col xl={6}>
                      <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-warning py-1 px-2 text-decoration-none border rounded-2">Warning focus</Link></p>
                      <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-info py-1 px-2 text-decoration-none border rounded-2">Info focus</Link></p>
                      <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-light py-1 px-2 text-decoration-none border rounded-2">Light focus</Link></p>
                      <p><Link to="#!" className="d-inline-flex focus-ring focus-ring-dark py-1 px-2 text-decoration-none border rounded-2">Dark focus</Link></p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiButtons;
