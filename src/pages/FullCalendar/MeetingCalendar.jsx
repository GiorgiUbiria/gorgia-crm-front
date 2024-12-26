import React, { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import Select from "react-select"
import ka from "@fullcalendar/core/locales/ka"
import moment from "moment-timezone"
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  updateAttendeeStatus,
} from "../../services/meetingService"
import useFetchUsers from "hooks/useFetchUsers"

const MeetingCalendar = () => {
  const [modal, setModal] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedView] = useState("dayGridMonth")
  const [popoverEvent, setPopoverEvent] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")

  const [currentMeeting, setCurrentMeeting] = useState({
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

  const { users: fetchedUsers, loading: usersLoading } = useFetchUsers()

  useEffect(() => {
    fetchMeetings()
  }, [filterStatus])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const response = await getMeetings()
      let filteredMeetings = response.data

      if (filterStatus !== "all") {
        filteredMeetings = filteredMeetings.filter(
          meeting => meeting.status === filterStatus
        )
      }

      const formattedMeetings = filteredMeetings.map(meeting => ({
        ...meeting,
        backgroundColor: getStatusColor(meeting.status),
        borderColor: getStatusColor(meeting.status),
        extendedProps: {
          ...meeting.extendedProps,
          status: meeting.status,
        },
      }))

      setMeetings(formattedMeetings)
    } catch (error) {
      console.error("Error fetching meetings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = status => {
    const colors = {
      pending: "#ffc107",
      accepted: "#28a745",
      declined: "#dc3545",
      tentative: "#17a2b8",
    }
    return colors[status] || "#0056b3"
  }

  const handleDateClick = arg => {
    const startDate = new Date(arg.date)
    const endDate = new Date(arg.date.getTime() + 3600000)

    resetForm()
    setCurrentMeeting({
      title: "",
      start: startDate,
      end: endDate,
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
  }

  const handleEventClick = arg => {
    const event = arg.event
    if (arg.jsEvent.target.classList.contains("quick-view-trigger")) {
      setPopoverEvent(event)
      return
    }

    const attendees = event.extendedProps.attendees || []
    const attendeeOptions = attendees.map(attendee => ({
      value: attendee.id,
      label: attendee.name,
    }))

    setCurrentMeeting({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      invitees: attendeeOptions,
      reason: event.extendedProps.reason || "",
      comments: event.extendedProps.comments || "",
      status: event.extendedProps.status || "pending",
      isRecurring: event.extendedProps.isRecurring || false,
      recurrence: event.extendedProps.recurrence || {
        frequency: "none",
        interval: 1,
        endDate: null,
      },
    })
    setModal(true)
  }

  const handleEventDrop = async info => {
    try {
      const { event } = info
      await updateMeeting(event.id, {
        ...currentMeeting,
        start: event.start,
        end: event.end,
      })
      await fetchMeetings()
    } catch (error) {
      console.error("Error updating meeting time:", error)
      info.revert()
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

  const getEventContent = eventInfo => {
    return (
      <div className="p-1">
        <div className="font-medium text-sm">{eventInfo.event.title}</div>
        <div className="text-xs mt-0.5 flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {moment(eventInfo.event.start).format("HH:mm")} -{" "}
          {moment(eventInfo.event.end).format("HH:mm")}
        </div>
      </div>
    )
  }

  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: selectedView,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
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
    eventBackgroundColor: "transparent",
    eventBorderColor: "transparent",
    eventTextColor: "inherit",
    dayCellClassNames: "min-h-[120px] hover:bg-slate-50 transition-colors",
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
    eventClassNames: ({ event }) => [
      "rounded-md shadow-sm border-l-4 px-2 py-1 mb-1 cursor-pointer transition-all hover:shadow-md",
      {
        "border-amber-500 bg-amber-50 text-amber-900":
          event.extendedProps.status === "pending",
        "border-emerald-500 bg-emerald-50 text-emerald-900":
          event.extendedProps.status === "accepted",
        "border-rose-500 bg-rose-50 text-rose-900":
          event.extendedProps.status === "declined",
        "border-sky-500 bg-sky-50 text-sky-900":
          event.extendedProps.status === "tentative",
      },
    ],
    buttonClassNames:
      "bg-primary-600 text-white rounded px-3 py-1 text-sm font-medium hover:bg-primary-700 transition-colors",
    buttonText: {
      today: "დღეს",
      month: "თვე",
      week: "კვირა",
      day: "დღე",
    },
    contentHeight: "auto",
    aspectRatio: 1.5,
    handleWindowResize: true,
    dayMaxEvents: true,
    viewClassNames: "bg-white rounded-lg shadow-lg p-4",
    dayHeaderClassNames: "text-gray-700 font-medium py-2",
    slotLabelClassNames: "text-gray-600 font-medium",
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {loading && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        <div className="mb-4 sm:mb-6 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            კალენდარი
          </h1>

          <div className="flex flex-wrap gap-2">
            {["all", "pending", "accepted", "declined"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all
                  ${
                    filterStatus === status
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 sm:p-4">
            <FullCalendar
              {...calendarOptions}
              events={meetings}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventContent={getEventContent}
            />
          </div>
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4">
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setModal(false)}
              />

              <div className="relative bg-white w-full sm:rounded-xl shadow-2xl sm:max-w-2xl">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {currentMeeting.id
                      ? "შეხვედრის რედაქტირება"
                      : "ახალი შეხვედრა"}
                  </h2>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="p-4 sm:p-6 space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        სათაური
                      </label>
                      <input
                        type="text"
                        value={currentMeeting.title}
                        onChange={e =>
                          setCurrentMeeting({
                            ...currentMeeting,
                            title: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        სტატუსი
                      </label>
                      <select
                        value={currentMeeting.status}
                        onChange={e =>
                          setCurrentMeeting({
                            ...currentMeeting,
                            status: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                        disabled={loading}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                        <option value="tentative">Tentative</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        დაწყების დრო
                      </label>
                      <input
                        type="datetime-local"
                        value={formatDateTimeLocal(currentMeeting.start)}
                        onChange={e => handleTimeChange(e, "start")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                        required
                        disabled={loading}
                        step="900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        დასრულების დრო
                      </label>
                      <input
                        type="datetime-local"
                        value={formatDateTimeLocal(currentMeeting.end)}
                        onChange={e => handleTimeChange(e, "end")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                        required
                        disabled={loading}
                        step="900"
                        min={formatDateTimeLocal(currentMeeting.start)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        მონაწილეები
                      </label>
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
                        className="basic-multi-select text-sm"
                        classNamePrefix="select"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={currentMeeting.isRecurring}
                          onChange={e =>
                            setCurrentMeeting({
                              ...currentMeeting,
                              isRecurring: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        Recurring Meeting
                      </label>
                    </div>
                  </div>

                  {currentMeeting.isRecurring && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Frequency
                        </label>
                        <select
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
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Interval
                        </label>
                        <input
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
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
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
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        მიზეზი
                      </label>
                      <textarea
                        value={currentMeeting.reason}
                        onChange={e =>
                          setCurrentMeeting({
                            ...currentMeeting,
                            reason: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
                        disabled={loading}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        კომენტარები
                      </label>
                      <textarea
                        value={currentMeeting.comments}
                        onChange={e =>
                          setCurrentMeeting({
                            ...currentMeeting,
                            comments: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
                        disabled={loading}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-100">
                    {currentMeeting.id && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        წაშლა
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setModal(false)}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      გაუქმება
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      {currentMeeting.id ? "განახლება" : "შექმნა"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {popoverEvent && (
          <div className="fixed sm:absolute bottom-0 sm:bottom-auto left-0 sm:left-auto w-full sm:w-auto sm:max-w-sm z-40 bg-white sm:rounded-lg shadow-xl p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-900">
                {popoverEvent.title}
              </h3>
              <button
                onClick={() => setPopoverEvent(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {moment(popoverEvent.start).format("LT")} -{" "}
                {moment(popoverEvent.end).format("LT")}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <span
                  className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    popoverEvent.extendedProps.status === "pending" &&
                    "bg-amber-100 text-amber-800"
                  }
                  ${
                    popoverEvent.extendedProps.status === "accepted" &&
                    "bg-emerald-100 text-emerald-800"
                  }
                  ${
                    popoverEvent.extendedProps.status === "declined" &&
                    "bg-rose-100 text-rose-800"
                  }
                  ${
                    popoverEvent.extendedProps.status === "tentative" &&
                    "bg-sky-100 text-sky-800"
                  }
                `}
                >
                  {popoverEvent.extendedProps.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleStatusUpdate(popoverEvent.id, "accepted")}
                className="flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate(popoverEvent.id, "declined")}
                className="flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MeetingCalendar
