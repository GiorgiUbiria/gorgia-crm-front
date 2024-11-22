import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardBody, Modal, ModalHeader, ModalBody, Form, 
         FormGroup, Label, Input, Button } from 'reactstrap';
import { 
  getMeetings, 
  createMeeting, 
  updateMeeting, 
  deleteMeeting,
  updateAttendeeStatus 
} from '../../services/meetingService';
import Select from 'react-select';

import './MeetingCalendar.scss';
import useFetchUsers from 'hooks/useFetchUsers';
import ka from '@fullcalendar/core/locales/ka';
import moment from 'moment-timezone';

const MeetingCalendar = () => {
  const [modal, setModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState({
    title: '',
    start: '',
    end: '',
    invitees: [],
    reason: '',
    comments: '',
  });
  const { users: fetchedUsers, loading: usersLoading } = useFetchUsers();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await getMeetings();
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
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
      comments: ''
    });
    setModal(true);
  };

  const handleEventClick = (arg) => {
    const attendees = arg.event.extendedProps.attendees || [];
    const attendeeOptions = attendees.map(attendee => ({
      value: attendee.id,
      label: attendee.name
    }));

    setCurrentMeeting({
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.start,
      end: arg.event.end,
      invitees: attendeeOptions,
      reason: arg.event.extendedProps.reason || '',
      comments: arg.event.extendedProps.comments || ''
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (currentMeeting.id) {
        await updateMeeting(currentMeeting.id, currentMeeting);
      } else {
        await createMeeting(currentMeeting);
      }
      
      await fetchMeetings(); // Refresh meetings list
      setModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentMeeting.id) return;
    
    try {
      setLoading(true);
      await deleteMeeting(currentMeeting.id);
      await fetchMeetings();
      setModal(false);
      resetForm();
    } catch (error) {
      console.error('Error deleting meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentMeeting({
      id: null,
      title: '',
      start: '',
      end: '',
      invitees: [],
      reason: '',
      comments: ''
    });
  };

  const formatDateTimeLocal = (date) => {
    if (!date) return '';
    return moment(date)
      .tz('Asia/Tbilisi')
      .format('YYYY-MM-DDTHH:mm');
  };

  const handleTimeChange = (e, field) => {
    const newDate = moment.tz(e.target.value, 'Asia/Tbilisi').toDate();
    if (!isNaN(newDate.getTime())) {
      setCurrentMeeting(prev => ({
        ...prev,
        [field]: newDate
      }));
    }
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, '0');
        const minute = (j * 30).toString().padStart(2, '0');
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  const slotDuration = '00:15:00';
  
  const renderToolbar = {
    left: 'prev,next today',
    center: 'title',
    right: 'scheduleButton dayGridMonth,timeGridWeek,timeGridDay'
  };

  const customButtons = {
    scheduleButton: {
      text: 'შეხვედრის დაგეგმვა',
      click: () => {
        const now = new Date();
        resetForm();
        setCurrentMeeting({
          title: '',
          start: now,
          end: new Date(now.getTime() + 60 * 60 * 1000),
          invitees: [],
          reason: '',
          comments: ''
        });
        setModal(true);
      }
    }
  };

  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'scheduleButton dayGridMonth,timeGridWeek,timeGridDay'
    },
    customButtons: {
      scheduleButton: {
        text: 'შეხვედრის დაგეგმვა',
        click: () => {
          const now = new Date();
          resetForm();
          setCurrentMeeting({
            title: '',
            start: now,
            end: new Date(now.getTime() + 60 * 60 * 1000),
            invitees: [],
            reason: '',
            comments: ''
          });
          setModal(true);
        }
      }
    },
    timeZone: 'Asia/Tbilisi',
    locale: ka,
    slotDuration: '00:15:00',
    slotMinTime: '09:00:00',
    slotMaxTime: '19:00:00',
    slotLabelInterval: '01:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      meridiem: false
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      meridiem: false
    },
    height: 'auto',
    eventDisplay: 'block',
    eventBackgroundColor: '#0056b3',
    eventBorderColor: '#0056b3',
    eventTextColor: '#ffffff',
    dayCellClassNames: 'calendar-day',
    nowIndicator: true,
    views: {
      timeGrid: {
        slotDuration: '00:15:00',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          meridiem: false
        },
        nowIndicator: true,
        dayMaxEvents: true,
      },
      dayGrid: {
        dayMaxEvents: true,
      }
    }
  };

  return (
    <Card className="calendar-card">
      <CardBody>
        <FullCalendar
          {...calendarOptions}
          events={meetings}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />

        <Modal isOpen={modal} toggle={() => setModal(!modal)} className="meeting-modal">
          <ModalHeader toggle={() => setModal(!modal)}>
            {currentMeeting.id ? 'შეხვედრის რედაქტირება' : 'ახალი შეხვედრა'}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit} className="meeting-form">
              <FormGroup>
                <Label>სათაური</Label>
                <Input
                  type="text"
                  value={currentMeeting.title}
                  onChange={(e) => setCurrentMeeting({...currentMeeting, title: e.target.value})}
                  required
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <Label>დაწყების დრო</Label>
                <Input
                  type="datetime-local"
                  value={formatDateTimeLocal(currentMeeting.start)}
                  onChange={(e) => handleTimeChange(e, 'start')}
                  required
                  disabled={loading}
                  step="900"
                  className="time-input"
                />
              </FormGroup>
              <FormGroup>
                <Label>დასრულების დრო</Label>
                <Input
                  type="datetime-local"
                  value={formatDateTimeLocal(currentMeeting.end)}
                  onChange={(e) => handleTimeChange(e, 'end')}
                  required
                  disabled={loading}
                  step="900"
                  min={formatDateTimeLocal(currentMeeting.start)}
                  className="time-input"
                />
              </FormGroup>
              <FormGroup>
                <Label>მონაწილეები</Label>
                <Select
                  isMulti
                  value={currentMeeting.invitees}
                  onChange={(selectedOptions) => setCurrentMeeting({
                    ...currentMeeting,
                    invitees: selectedOptions
                  })}
                  options={fetchedUsers.map(user => ({
                    value: user.id,
                    label: user.name
                  }))}
                  isDisabled={loading || usersLoading}
                  placeholder="აირჩიეთ მონაწილეები"
                  noOptionsMessage={() => "მონაწილეები არ მოიძებნა"}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </FormGroup>
              <FormGroup>
                <Label>მიზეზი</Label>
                <Input
                  type="textarea"
                  value={currentMeeting.reason}
                  onChange={(e) => setCurrentMeeting({...currentMeeting, reason: e.target.value})}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <Label>კომენტარები</Label>
                <Input
                  type="textarea"
                  value={currentMeeting.comments}
                  onChange={(e) => setCurrentMeeting({...currentMeeting, comments: e.target.value})}
                  disabled={loading}
                />
              </FormGroup>
              <div className="d-flex justify-content-between">
                <Button color="primary" type="submit" disabled={loading}>
                  {currentMeeting.id ? 'განახლება' : 'შექმნა'}
                </Button>
                {currentMeeting.id && (
                  <Button color="danger" type="button" onClick={handleDelete} disabled={loading}>
                    წაშლა
                  </Button>
                )}
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default MeetingCalendar;