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
    const endDate = new Date(arg.date.getTime() + 3600000); // 1 hour later
    
    setSelectedDate(startDate);
    setCurrentMeeting({
      ...currentMeeting,
      start: startDate,
      end: endDate
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
      title: '',
      start: '',
      end: '',
      invitees: [],
      reason: '',
      comments: ''
    });
  };

  return (
    <Card>
      <CardBody>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height={600}
          events={meetings}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
        />

        <Modal isOpen={modal} toggle={() => setModal(!modal)}>
          <ModalHeader toggle={() => setModal(!modal)}>
            {currentMeeting.id ? 'Edit Meeting' : 'New Meeting'}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={currentMeeting.title}
                  onChange={(e) => setCurrentMeeting({...currentMeeting, title: e.target.value})}
                  required
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  value={currentMeeting.start ? new Date(currentMeeting.start).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setCurrentMeeting({...currentMeeting, start: new Date(e.target.value)})}
                  required
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  value={currentMeeting.end ? new Date(currentMeeting.end).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setCurrentMeeting({...currentMeeting, end: new Date(e.target.value)})}
                  required
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <Label>Invitees</Label>
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
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </FormGroup>
              <FormGroup>
                <Label>Reason</Label>
                <Input
                  type="textarea"
                  value={currentMeeting.reason}
                  onChange={(e) => setCurrentMeeting({...currentMeeting, reason: e.target.value})}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <Label>Comments</Label>
                <Input
                  type="textarea"
                  value={currentMeeting.comments}
                  onChange={(e) => setCurrentMeeting({...currentMeeting, comments: e.target.value})}
                  disabled={loading}
                />
              </FormGroup>
              <div className="d-flex justify-content-between">
                <Button color="primary" type="submit" disabled={loading}>
                  {currentMeeting.id ? 'Update Meeting' : 'Create Meeting'}
                </Button>
                {currentMeeting.id && (
                  <Button color="danger" type="button" onClick={handleDelete} disabled={loading}>
                    Delete Meeting
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
