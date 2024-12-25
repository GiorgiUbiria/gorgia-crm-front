import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardBody, Modal, ModalHeader, ModalBody, Form, 
         FormGroup, Label, Input, Button, Spinner, Badge,
         Popover, PopoverBody, ButtonGroup, Row, Col } from 'reactstrap';
import { 
  getMeetings, 
  createMeeting, 
  updateMeeting, 
  deleteMeeting,
  updateAttendeeStatus
} from '../../services/meetingService';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';
import './MeetingCalendar.scss';
import useFetchUsers from 'hooks/useFetchUsers';
import ka from '@fullcalendar/core/locales/ka';
import moment from 'moment-timezone';

const MeetingCalendar = () => {
  const [modal, setModal] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedView] = useState('dayGridMonth');
  const [popoverEvent, setPopoverEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [currentMeeting, setCurrentMeeting] = useState({
    title: '',
    start: '',
    end: '',
    invitees: [],
    reason: '',
    comments: '',
    status: 'pending',
    isRecurring: false,
    recurrence: {
      frequency: 'none',
      interval: 1,
      endDate: null
    }
  });

  const { users: fetchedUsers, loading: usersLoading } = useFetchUsers();

  useEffect(() => {
    fetchMeetings();
  }, [filterStatus]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await getMeetings();
      let filteredMeetings = response.data;
      
      if (filterStatus !== 'all') {
        filteredMeetings = filteredMeetings.filter(meeting => meeting.status === filterStatus);
      }
      
      const formattedMeetings = filteredMeetings.map(meeting => ({
        ...meeting,
        backgroundColor: getStatusColor(meeting.status),
        borderColor: getStatusColor(meeting.status),
        extendedProps: {
          ...meeting.extendedProps,
          status: meeting.status
        }
      }));
      
      setMeetings(formattedMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      accepted: '#28a745',
      declined: '#dc3545',
      tentative: '#17a2b8'
    };
    return colors[status] || '#0056b3';
  };

  const handleDateClick = (arg) => {
    const startDate = new Date(arg.date);
    const endDate = new Date(arg.date.getTime() + 3600000);
    
    resetForm();
    setCurrentMeeting({
      title: '',
      start: startDate,
      end: endDate,
      invitees: [],
      reason: '',
      comments: '',
      status: 'pending',
      isRecurring: false,
      recurrence: {
        frequency: 'none',
        interval: 1,
        endDate: null
      }
    });
    setModal(true);
  };

  const handleEventClick = (arg) => {
    const event = arg.event;
    if (arg.jsEvent.target.classList.contains('quick-view-trigger')) {
      setPopoverEvent(event);
      return;
    }

    const attendees = event.extendedProps.attendees || [];
    const attendeeOptions = attendees.map(attendee => ({
      value: attendee.id,
      label: attendee.name
    }));

    setCurrentMeeting({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      invitees: attendeeOptions,
      reason: event.extendedProps.reason || '',
      comments: event.extendedProps.comments || '',
      status: event.extendedProps.status || 'pending',
      isRecurring: event.extendedProps.isRecurring || false,
      recurrence: event.extendedProps.recurrence || {
        frequency: 'none',
        interval: 1,
        endDate: null
      }
    });
    setModal(true);
  };

  const handleEventDrop = async (info) => {
    try {
      const { event } = info;
      await updateMeeting(event.id, {
        ...currentMeeting,
        start: event.start,
        end: event.end
      });
      await fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting time:', error);
      info.revert();
    }
  };

  const handleStatusUpdate = async (meetingId, status) => {
    try {
      setLoading(true);
      await updateAttendeeStatus(meetingId, status);
      await fetchMeetings();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)

      if (currentMeeting.id) {
        await updateMeeting(currentMeeting.id, currentMeeting)
      } else {
        await createMeeting(currentMeeting)
      }

      await fetchMeetings() // Refresh meetings list
      setModal(false)
      resetForm()
    } catch (error) {
      console.error("Error saving meeting:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentMeeting.id) return

    try {
      setLoading(true)
      await deleteMeeting(currentMeeting.id)
      await fetchMeetings()
      setModal(false)
      resetForm()
    } catch (error) {
      console.error("Error deleting meeting:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentMeeting({
      id: null,
      title: "",
      start: "",
      end: "",
      invitees: [],
      reason: "",
      comments: "",
      status: "pending",
      isRecurring: false,
      recurrence: {
        frequency: "none",
        interval: 1,
        endDate: null,
      },
    })
  }

  const formatDateTimeLocal = date => {
    if (!date) return ""
    return moment(date).tz("Asia/Tbilisi").format("YYYY-MM-DDTHH:mm")
  }

  const handleTimeChange = (e, field) => {
    const newDate = moment.tz(e.target.value, "Asia/Tbilisi").toDate()
    if (!isNaN(newDate.getTime())) {
      setCurrentMeeting(prev => ({
        ...prev,
        [field]: newDate,
      }))
    }
  }

  const getEventContent = (eventInfo) => {
    return (
      <div 
        className={`fc-event-content status-${eventInfo.event.extendedProps.status || 'pending'}`}
        data-tooltip-id="meeting-tooltip"
        data-tooltip-content={`${eventInfo.event.title}
Status: ${eventInfo.event.extendedProps.status || 'pending'}
Reason: ${eventInfo.event.extendedProps.reason || 'N/A'}`}
      >
        <div className="fc-event-title">{eventInfo.event.title}</div>
        <div className="fc-event-time">
          {moment(eventInfo.event.start).format('HH:mm')} - {moment(eventInfo.event.end).format('HH:mm')}
        </div>
      </div>
    );
  };

  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: selectedView,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right:
        "filterDropdown scheduleButton dayGridMonth,timeGridWeek,timeGridDay",
    },
    customButtons: {
      scheduleButton: {
        text: "შეხვედის დაგეგმვა",
        click: () => {
          const now = new Date()
          resetForm()
          setCurrentMeeting({
            title: "",
            start: now,
            end: new Date(now.getTime() + 60 * 60 * 1000),
            invitees: [],
            reason: "",
            comments: "",
            status: "pending",
            isRecurring: false,
            recurrence: {
              frequency: "none",
              interval: 1,
              endDate: null,
            },
          })
          setModal(true)
        },
      },
      filterDropdown: {
        text: "Filter",
        click: function () {
          // Toggle filter options
        },
      },
    },
    editable: true,
    eventDrop: handleEventDrop,
    eventContent: getEventContent,
    timeZone: "Asia/Tbilisi",
    locale: ka,
    slotDuration: "00:15:00",
    slotMinTime: "09:00:00",
    slotMaxTime: "19:00:00",
    slotLabelInterval: "01:00",
    slotLabelFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      meridiem: false,
    },
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      meridiem: false,
    },
    height: "auto",
    eventDisplay: "block",
    eventBackgroundColor: "#0056b3",
    eventBorderColor: "#0056b3",
    eventTextColor: "#ffffff",
    dayCellClassNames: "calendar-day",
    nowIndicator: true,
    views: {
      timeGrid: {
        slotDuration: "00:15:00",
        slotLabelFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          meridiem: false,
        },
        nowIndicator: true,
        dayMaxEvents: true,
      },
      dayGrid: {
        dayMaxEvents: true,
      },
    },
  }

  return (
    <Card className="calendar-card">
      <CardBody>
        {loading && (
          <div className="calendar-loading">
            <Spinner color="primary" />
          </div>
        )}

        <div className="calendar-filters mb-3">
          <ButtonGroup>
            <Button
              color={filterStatus === "all" ? "primary" : "secondary"}
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              color={filterStatus === "pending" ? "primary" : "secondary"}
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Button>
            <Button
              color={filterStatus === "accepted" ? "primary" : "secondary"}
              onClick={() => setFilterStatus("accepted")}
            >
              Accepted
            </Button>
          </ButtonGroup>
        </div>

        <FullCalendar
          {...calendarOptions}
          events={meetings}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={getEventContent}
        />

        <Tooltip id="meeting-tooltip" place="top" transition={{ timeout: 200 }} />

        <Modal
          isOpen={modal}
          toggle={() => setModal(!modal)}
          className="meeting-modal"
          size="lg"
        >
          <ModalHeader toggle={() => setModal(!modal)}>
            {currentMeeting.id ? "შეხვედრის რედაქტირება" : "ახალი შეხვედრა"}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit} className="meeting-form">
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>სათაური</Label>
                    <Input
                      type="text"
                      value={currentMeeting.title}
                      onChange={e =>
                        setCurrentMeeting({
                          ...currentMeeting,
                          title: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>სტატუსი</Label>
                    <Input
                      type="select"
                      value={currentMeeting.status}
                      onChange={e =>
                        setCurrentMeeting({
                          ...currentMeeting,
                          status: e.target.value,
                        })
                      }
                      disabled={loading}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                      <option value="tentative">Tentative</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>დაწყების დრო</Label>
                    <Input
                      type="datetime-local"
                      value={formatDateTimeLocal(currentMeeting.start)}
                      onChange={e => handleTimeChange(e, "start")}
                      required
                      disabled={loading}
                      step="900"
                      className="time-input"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>დასრულების დრო</Label>
                    <Input
                      type="datetime-local"
                      value={formatDateTimeLocal(currentMeeting.end)}
                      onChange={e => handleTimeChange(e, "end")}
                      required
                      disabled={loading}
                      step="900"
                      min={formatDateTimeLocal(currentMeeting.start)}
                      className="time-input"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label>მონაწილეები</Label>
                <Select
                  isMulti
                  value={currentMeeting.invitees}
                  onChange={selectedOptions =>
                    setCurrentMeeting({
                      ...currentMeeting,
                      invitees: selectedOptions,
                    })
                  }
                  options={fetchedUsers.map(user => ({
                    value: user.id,
                    label: user.name,
                  }))}
                  isDisabled={loading || usersLoading}
                  placeholder="აირჩიეთ მონაწილეები"
                  noOptionsMessage={() => "მონაწილეები არ მოიძებნა"}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <Input
                    type="checkbox"
                    checked={currentMeeting.isRecurring}
                    onChange={e =>
                      setCurrentMeeting({
                        ...currentMeeting,
                        isRecurring: e.target.checked,
                      })
                    }
                  />{" "}
                  Recurring Meeting
                </Label>
              </FormGroup>

              {currentMeeting.isRecurring && (
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Frequency</Label>
                      <Input
                        type="select"
                        value={currentMeeting.recurrence.frequency}
                        onChange={e =>
                          setCurrentMeeting({
                            ...currentMeeting,
                            recurrence: {
                              ...currentMeeting.recurrence,
                              frequency: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Interval</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentMeeting.recurrence.interval}
                        onChange={e =>
                          setCurrentMeeting({
                            ...currentMeeting,
                            recurrence: {
                              ...currentMeeting.recurrence,
                              interval: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={currentMeeting.recurrence.endDate}
                        onChange={e =>
                          setCurrentMeeting({
                            ...currentMeeting,
                            recurrence: {
                              ...currentMeeting.recurrence,
                              endDate: e.target.value,
                            },
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )}

              <FormGroup>
                <Label>მიზეზი</Label>
                <Input
                  type="textarea"
                  value={currentMeeting.reason}
                  onChange={e =>
                    setCurrentMeeting({
                      ...currentMeeting,
                      reason: e.target.value,
                    })
                  }
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label>კომენტარები</Label>
                <Input
                  type="textarea"
                  value={currentMeeting.comments}
                  onChange={e =>
                    setCurrentMeeting({
                      ...currentMeeting,
                      comments: e.target.value,
                    })
                  }
                  disabled={loading}
                />
              </FormGroup>

              <div className="d-flex justify-content-between">
                <Button color="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <Spinner size="sm" />
                  ) : currentMeeting.id ? (
                    "განახლება"
                  ) : (
                    "შექმნა"
                  )}
                </Button>
                {currentMeeting.id && (
                  <Button
                    color="danger"
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "წაშლა"}
                  </Button>
                )}
              </div>
            </Form>
          </ModalBody>
        </Modal>

        {/* Quick View Popover */}
        {popoverEvent && (
          <Popover
            placement="top"
            isOpen={!!popoverEvent}
            target={popoverEvent.el}
            toggle={() => setPopoverEvent(null)}
          >
            <PopoverBody>
              <h5>{popoverEvent.title}</h5>
              <p>
                <strong>Time:</strong> {moment(popoverEvent.start).format("LT")}{" "}
                - {moment(popoverEvent.end).format("LT")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  color={getStatusColor(popoverEvent.extendedProps.status)}
                >
                  {popoverEvent.extendedProps.status}
                </Badge>
              </p>
              <div className="mt-2">
                <ButtonGroup size="sm">
                  <Button
                    color="success"
                    onClick={() =>
                      handleStatusUpdate(popoverEvent.id, "accepted")
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    color="danger"
                    onClick={() =>
                      handleStatusUpdate(popoverEvent.id, "declined")
                    }
                  >
                    Decline
                  </Button>
                </ButtonGroup>
              </div>
            </PopoverBody>
          </Popover>
        )}
      </CardBody>
    </Card>
  )
}

export default MeetingCalendar
