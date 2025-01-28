import React, { useState } from "react"
import classNames from "classnames"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./calendar.css"
import { ka } from "date-fns/locale"
import CrmSpinner from "components/CrmSpinner"
import { useCalendarQueries } from "queries/calendar"
import EventDialog from "./components/EventDialog"
import EventDetailsDialog from "./components/EventDetailsDialog"
import { DialogButton } from "components/CrmDialogs/Dialog"

const locales = {
  ka: ka,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const views = {
  month: true,
  week: true,
  day: true,
}

const Calendar = () => {
  const [view, setView] = useState("month")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const { events, isEventsLoading } = useCalendarQueries()

  const handleSelectSlot = slotInfo => {
    setSelectedSlot(slotInfo)
    setIsCreateEventOpen(true)
  }

  const handleSelectEvent = event => {
    setSelectedEvent(event)
  }

  const handleCloseEventDialog = () => {
    setIsCreateEventOpen(false)
    setSelectedSlot(null)
  }

  const handleCloseEventDetails = () => {
    setSelectedEvent(null)
  }

  const calendarEvents =
    events?.map(event => ({
      ...event,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      title: event.title,
    })) || []

  if (isEventsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <CrmSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:!text-white">
          კალენდარი
        </h1>
        <DialogButton
          actionType="add"
          onClick={() => {
            setSelectedSlot({ start: new Date(), end: new Date() })
            setIsCreateEventOpen(true)
          }}
        />
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:!border-gray-700 dark:!bg-gray-800">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={views}
          view={view}
          onView={setView}
          date={selectedDate}
          onNavigate={setSelectedDate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          popup
          className={classNames(
            "calendar-custom",
            "dark:!text-white dark:!bg-gray-800",
            "rbc-calendar",
            "dark:rbc-calendar-dark"
          )}
        />
      </div>

      <EventDialog
        isOpen={isCreateEventOpen}
        onClose={handleCloseEventDialog}
        selectedSlot={selectedSlot}
      />

      <EventDetailsDialog
        isOpen={!!selectedEvent}
        onClose={handleCloseEventDetails}
        event={selectedEvent}
      />
    </div>
  )
}

export default Calendar
