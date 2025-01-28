import React, { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import Select from "react-select"
import kaLocale from "@fullcalendar/core/locales/ka"
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  updateAttendeeStatus,
  updateMeetingStatus,
  addComment,
  updateRecurringMeeting,
  deleteRecurringMeeting,
} from "../../services/meetingService"
import useFetchUsers from "hooks/useFetchUsers"
import DeleteModal from "../../components/DeleteModal"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"

const formatDateForInput = date => {
  if (!date) return ""
  const d = new Date(date)
  return d.toISOString().slice(0, 16)
}

const Calendar = () => {
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [currentMeeting, setCurrentMeeting] = useState({
    title: "",
    information: "",
    start: new Date(),
    end: new Date(),
    type: "single",
    recurrence_type: "daily",
    recurrence_end_date: null,
    status: "active",
    attendees: [],
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [commentModal, setCommentModal] = useState(false)
  const [currentComment, setCurrentComment] = useState("")

  const { users } = useFetchUsers()

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const response = await getMeetings()
      setMeetings(response.data)
    } catch (error) {
      console.error("Error fetching meetings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setCurrentMeeting(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)

      if (currentMeeting.id) {
        if (currentMeeting.type === "recurring") {
          await updateRecurringMeeting(currentMeeting.id, currentMeeting)
        } else {
          await updateMeeting(currentMeeting.id, currentMeeting)
        }
      } else {
        await createMeeting(currentMeeting)
      }

      await fetchMeetings()
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
      if (currentMeeting.type === "recurring") {
        await deleteRecurringMeeting(currentMeeting.id)
      } else {
        await deleteMeeting(currentMeeting.id)
      }
      await fetchMeetings()
      setModal(false)
      resetForm()
    } catch (error) {
      console.error("Error deleting meeting:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!currentComment.trim()) return

    try {
      setLoading(true)
      await addComment(currentMeeting.id, currentComment)
      await fetchMeetings()
      setCommentModal(false)
      setCurrentComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (meetingId, status) => {
    try {
      setLoading(true)
      await updateAttendeeStatus(meetingId, status)
      await fetchMeetings()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMeetingStatusUpdate = async (meetingId, status) => {
    try {
      setLoading(true)
      await updateMeetingStatus(meetingId, status)
      await fetchMeetings()
    } catch (error) {
      console.error("Error updating meeting status:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentMeeting({
      title: "",
      information: "",
      start: new Date(),
      end: new Date(),
      type: "single",
      recurrence_type: "daily",
      recurrence_end_date: null,
      status: "active",
      attendees: [],
    })
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {loading && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 sm:p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={meetings}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              locale={kaLocale}
              timeZone="Asia/Tbilisi"
              eventClick={info => {
                setCurrentMeeting({
                  id: info.event.id,
                  title: info.event.title,
                  information: info.event.extendedProps.information,
                  start: info.event.start,
                  end: info.event.end,
                  type: info.event.extendedProps.type || "single",
                  recurrence_type:
                    info.event.extendedProps.recurrence_type || "daily",
                  recurrence_end_date:
                    info.event.extendedProps.recurrence_end_date,
                  status: info.event.extendedProps.status || "active",
                  attendees: info.event.extendedProps.attendees || [],
                })
                setModal(true)
              }}
              select={info => {
                setCurrentMeeting({
                  ...currentMeeting,
                  start: info.start,
                  end: info.end,
                })
                setModal(true)
              }}
            />
          </div>
        </div>

        <Modal
          isOpen={modal}
          toggle={() => {
            setModal(false)
            resetForm()
          }}
        >
          <ModalHeader toggle={() => setModal(false)}>
            {currentMeeting.id ? "შეხვედრის რედაქტირება" : "ახალი შეხვედრა"}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    სათაური
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentMeeting.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ინფორმაცია
                  </label>
                  <textarea
                    name="information"
                    value={currentMeeting.information}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    შეხვედრის ტიპი
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="single"
                        checked={currentMeeting.type === "single"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">ერთჯერადი</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="recurring"
                        checked={currentMeeting.type === "recurring"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">განმეორებადი</span>
                    </label>
                  </div>
                </div>

                {currentMeeting.type === "recurring" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      განმეორების ტიპი
                    </label>
                    <select
                      name="recurrence_type"
                      value={currentMeeting.recurrence_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="daily">ყოველდღიური</option>
                      <option value="weekly">ყოველკვირეული</option>
                      <option value="monthly">ყოველთვიური</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    დაწყების დრო
                  </label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={formatDateForInput(currentMeeting.start)}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                {currentMeeting.type === "single" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      დასრულების დრო
                    </label>
                    <input
                      type="datetime-local"
                      name="end"
                      value={formatDateForInput(currentMeeting.end)}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                )}

                {currentMeeting.type === "recurring" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      განმეორების დასრულების თარიღი (არასავალდებულო)
                    </label>
                    <input
                      type="date"
                      name="recurrence_end_date"
                      value={currentMeeting.recurrence_end_date || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      თუ არ მიუთითებთ დასრულების თარიღს, შეხვედრები შეიქმნება
                      წლის ბოლომდე
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    მონაწილეები
                  </label>
                  <Select
                    isMulti
                    name="attendees"
                    value={currentMeeting.attendees}
                    onChange={selected =>
                      handleInputChange({
                        target: { name: "attendees", value: selected || [] },
                      })
                    }
                    options={users.map(user => ({
                      value: user.id,
                      label: `${user.name} ${user.sur_name}`,
                    }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>

                {currentMeeting.id && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      შეხვედრის სტატუსი
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleMeetingStatusUpdate(currentMeeting.id, "done")
                        }
                        className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        დასრულება
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleMeetingStatusUpdate(
                            currentMeeting.id,
                            "cancelled"
                          )
                        }
                        className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        გაუქმება
                      </button>
                    </div>
                  </div>
                )}

                {currentMeeting.id && !currentMeeting.isCreator && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      მონაწილეობის სტატუსი
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(currentMeeting.id, "accepted")
                        }
                        className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        დათანხმება
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(currentMeeting.id, "declined")
                        }
                        className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        უარყოფა
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 mt-4">
                  {currentMeeting.id && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      წაშლა
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading
                      ? "..."
                      : currentMeeting.id
                      ? "განახლება"
                      : "შექმნა"}
                  </button>
                </div>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
          isRecurring={currentMeeting.type === "recurring"}
        />

        <Modal isOpen={commentModal} toggle={() => setCommentModal(false)}>
          <ModalHeader toggle={() => setCommentModal(false)}>
            კომენტარის დამატება
          </ModalHeader>
          <ModalBody>
            <textarea
              value={currentComment}
              onChange={e => setCurrentComment(e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
              rows={4}
              placeholder="დაწერეთ კომენტარი..."
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={handleAddComment}
              disabled={loading}
            >
              დამატება
            </Button>
            <Button color="secondary" onClick={() => setCommentModal(false)}>
              გაუქმება
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}

export default Calendar
