import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import allLocales from '@fullcalendar/core/locales-all';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//import Images
import verification from "../../assets/images/verification-img.png";

import {
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  getCategories as onGetCategories,
  getEvents as onGetEvents,
  updateEvent as onUpdateEvent,
} from "../../store/actions";

import DeleteModal from "./DeleteModal";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const Calender = props => {

  //meta title
  document.title = "Calendar | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const [event, setEvent] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  // category validation
  const categoryValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (event && event.title) || '',
      category: (event && event.category) || '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Event Name"),
      category: Yup.string().required("Please Enter Your Billing Name"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateEvent = {
          id: event.id,
          title: values.title,
          classNames: values.category + " text-white",
          start: event.start,
        };
        // update event
        dispatch(onUpdateEvent(updateEvent));
        categoryValidation.resetForm();
      } else {
        const newEvent = {
          id: Math.floor(Math.random() * 100),
          title: values["title"],
          start: selectedDay ? selectedDay.date : new Date(),
          className: values['category']
            ? values['category'] + " text-white"
            : "bg-primary text-white"
          ,
        };
        // save new event
        dispatch(onAddNewEvent(newEvent));
        categoryValidation.resetForm()
      }
      toggle();
    },
  });


  const CalendarProperties = createSelector(
    (state) => state.calendar,
    (Calendar) => ({
      events: Calendar.events,
      categories: Calendar.categories,
    })
  );

  const { events, categories } = useSelector(CalendarProperties);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [modalCategory, setModalCategory] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    dispatch(onGetCategories());
    dispatch(onGetEvents());
    new Draggable(document.getElementById("external-events"), {
      itemSelector: ".external-event",
    });
  }, [dispatch]);

  useEffect(() => {
    if (!modalCategory && !isEmpty(event) && !!isEdit) {
      setTimeout(() => {
        setEvent({});
        setIsEdit(false);
      }, 500);
    }
  }, [modalCategory, event, isEdit]);

  /**
   * Handling the modal state
   */
  const toggle = () => {
    if (modalCategory) {
      setModalCategory(false);
      setEvent(null);
      setIsEdit(false);
    } else {
      setModalCategory(true);
    }
  };

  /**
   * Handling date click on calendar
   */
  const handleDateClick = (arg) => {
    const date = arg.date;
    if (!date) {
      console.error("Date is undefined in handleDateClick");
      return;
    }

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMin = currentDate.getMinutes();
    const currentSec = currentDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );
    const modifiedData = { ...arg, date: modifiedDate };

    setSelectedDay(modifiedData);
    toggle();
  };

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg) => {
    const event = arg.event;
    setEvent({
      id: event.id,
      title: event.title,
      // title_category: event.title_category,
      start: event.start,
      className: event.classNames,
      category: event.classNames[0],
      event_category: event.classNames[0],
    });
    setDeleteId(event.id)
    setIsEdit(true);
    setModalCategory(true)
    toggle();
  };

  /**
    * On delete event
  */
  const handleDeleteEvent = () => {
    if (deleteId) {
      dispatch(onDeleteEvent(deleteId));
    }
    setDeleteModal(false);
  };

  /**
   * On category darg event
   */
  const onDrag = (eventDraggable, category) => {
    eventDraggable.preventDefault();
  };

  /**
   * On calendar drop event
   */
  const onDrop = (eventDrop) => {
    const date = eventDrop.date;
    if (!date) {
      console.error("Date is undefined in onDrop");
      return;
    }

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMin = currentDate.getMinutes();
    const currentSec = currentDate.getSeconds();
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    );

    const draggedEl = eventDrop.draggedEl;
    const draggedElclass = draggedEl.className;
    if (
      draggedEl.classList.contains('external-event') &&
      draggedElclass.indexOf("fc-event-draggable") === -1
    ) {
      const modifiedData = {
        id: Math.floor(Math.random() * 100),
        title: draggedEl.innerText,
        start: modifiedDate,
        className: draggedEl.className,
      };
      dispatch(onAddNewEvent(modifiedData));
    }
  };

  // Set Georgian locale
  const [isLocal, setIsLocal] = useState(() => {
    const kaLocale = allLocales.find((locale) => locale.code === "ka");
    return kaLocale || allLocales[0]; // Fallback to first locale if Georgian not found
  });

  // Filter state
  const [filterCategory, setFilterCategory] = useState('All');

  // Filtered events based on selected category
  const filteredEvents = filterCategory === 'All' ? events : events.filter(event => event.className.includes(filterCategory));

  //set the local language
  const enLocal = {
    "code": "en-nz",
    "week": {
      "dow": 1,
      "doy": 4
    },
    "buttonHints": {
      "prev": "Previous $0",
      "next": "Next $0",
      "today": "This $0"
    },
    "viewHint": "$0 view",
    "navLinkHint": "Go to $0"
  };
  const handleChangeLocals = (selectedLocale) => {
    if (selectedLocale) {
      setIsLocal(selectedLocale);
    } else {
      console.warn("Selected locale is undefined");
    }
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid={true}>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Calendar" breadcrumbItem="შემოსვლები" />
          <Row>
            <Col xs={12}>
              <Row>
                <Col xl={3}>
                  <Card>
                    <CardBody>
                      <div className="d-flex flex-column gap-3">
                        {/* Locale Selector */}
                        <div className="d-flex gap-2">
                          <div className="flex-grow-1">
                            <select
                              id="locale-selector"
                              className="form-select"
                              value={isLocal.code}
                              onChange={(event) => {
                                const selectedValue = event.target.value;
                                const selectedLocale = allLocales.find((locale) => locale.code === selectedValue);
                                handleChangeLocals(selectedLocale);
                              }}
                            >
                              {allLocales.map((locale, key) => (
                                <option key={key} value={locale.code}>
                                  {locale.week?.dow === 1 ? "Monday Start" : "Sunday Start"} - {locale.code.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>
                          <Button
                            color="primary"
                            className="font-16"
                            onClick={toggle}
                          >
                            <i className="mdi mdi-plus-circle-outline me-1" />
                            Create New Event
                          </Button>
                        </div>

                        {/* Filter Selector */}
                        <div className="d-flex gap-2">
                          <div className="flex-grow-1">
                            <select
                              id="filter-selector"
                              className="form-select"
                              value={filterCategory}
                              onChange={(e) => setFilterCategory(e.target.value)}
                            >
                              <option value="All">All Categories</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.type}>
                                  {category.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* External Events */}
                        <div id="external-events" className="mt-2">
                          <br />
                          <p className="text-muted">
                            Drag and drop your event or click in the calendar
                          </p>
                          {categories &&
                            categories.map((category) => (
                              <div
                                className={`${category.type} external-event fc-event text-white`}
                                key={"cat-" + category.id}
                                draggable
                                onDrag={(eventDraggable) =>
                                  onDrag(eventDraggable, category)
                                }
                              >
                                <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2" />
                                {category.title}
                              </div>
                            ))}
                        </div>

                        <Row className="justify-content-center mt-5">
                          <img src={verification} alt="" className="img-fluid d-block" />
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col xl={9}>
                  <Card>
                    <CardBody>
                      {/* FullCalendar Control with Filtered Events */}
                      <FullCalendar
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          listPlugin,
                          interactionPlugin,
                        ]}
                        slotDuration={"00:15:00"}
                        handleWindowResize={true}
                        themeSystem="bootstrap"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                        }}
                        locale={isLocal.code}
                        events={filteredEvents}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        drop={onDrop}
                      />
                    </CardBody>
                  </Card>

                  <Modal
                    isOpen={modalCategory}
                    className={props.className}
                    centered
                  >
                    <ModalHeader toggle={toggle} tag="h5">
                      {!!isEdit ? "Edit Event" : "Add Event"}
                    </ModalHeader>
                    <ModalBody className="p-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          categoryValidation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label>Event Name</Label>
                              <Input
                                name="title"
                                type="text"
                                placeholder="Insert Event Name"
                                onChange={categoryValidation.handleChange}
                                onBlur={categoryValidation.handleBlur}
                                value={categoryValidation.values.title || ""}
                                invalid={
                                  categoryValidation.touched.title && categoryValidation.errors.title ? true : false
                                }
                              />
                              {categoryValidation.touched.title && categoryValidation.errors.title ? (
                                <FormFeedback type="invalid">{categoryValidation.errors.title}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label>Category</Label>
                              <Input
                                type="select"
                                name="category"
                                placeholder="All Day Event"
                                onChange={categoryValidation.handleChange}
                                onBlur={categoryValidation.handleBlur}
                                value={categoryValidation.values.category || ""}
                                invalid={
                                  categoryValidation.touched.category && categoryValidation.errors.category ? true : false
                                }
                              >
                                <option value="bg-danger">Danger</option>
                                <option value="bg-success">Success</option>
                                <option value="bg-primary">Primary</option>
                                <option value="bg-info">Info</option>
                                <option value="bg-dark">Dark</option>
                                <option value="bg-warning">Warning</option>
                              </Input>
                              {categoryValidation.touched.category && categoryValidation.errors.category ? (
                                <FormFeedback type="invalid">{categoryValidation.errors.category}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>

                        <Row className="mt-2">
                          <Col xs={6}>
                            {isEdit &&
                              <Button type="button" color="btn btn-danger" id="btn-delete-event" onClick={() => { toggle(); setDeleteModal(true) }}>Delete</Button>
                            }
                          </Col>

                          <Col xs={6} className="text-end">
                            <Button color="light"
                              type="button"
                              className="me-1"
                              onClick={toggle}
                            >
                              Close
                            </Button>
                            <Button
                              type="submit"
                              color="success"
                              id="btn-save-event"
                            >
                              Save
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

Calender.propTypes = {
  events: PropTypes.array,
  categories: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
};

export default Calender;
