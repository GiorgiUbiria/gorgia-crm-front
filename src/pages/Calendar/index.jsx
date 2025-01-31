import React, { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import kaLocale from "@fullcalendar/core/locales/ka"
import useAuth from "hooks/useAuth"

import { useGetCalendarEvents, useGetInvitedEvents } from "queries/calendar"
import CrmSpinner from "components/CrmSpinner"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import useModalStore from "store/zustand/modalStore"
import { AddCalendarEventForm } from "./components/add"
import { EditCalendarEventForm } from "./components/edit"
import { ViewCalendarEventDetails } from "./components/view"
import { PendingInvitations } from "./components/PendingInvitations"

const EVENT_COLORS = {
  single: {
    backgroundColor: "rgb(59, 130, 246)",
    borderColor: "rgb(37, 99, 235)",
    textColor: "white",
  },
  recurring: {
    backgroundColor: "rgb(168, 85, 247)",
    borderColor: "rgb(147, 51, 234)",
    textColor: "white",
  },
  task: {
    backgroundColor: "rgb(34, 197, 94)",
    borderColor: "rgb(22, 163, 74)",
    textColor: "white",
  },
}

const Calendar = () => {
  const { data: events, isLoading: isEventsLoading } = useGetCalendarEvents()
  const { data: invitedEvents, isLoading: isInvitedEventsLoading } =
    useGetInvitedEvents()
  const { isModalOpen, closeModal, openModal, modalParams } = useModalStore()
  const [selectedEventId, setSelectedEventId] = useState(null)
  const { user, isAdmin } = useAuth()

  const selectedEvent =
    events?.find(event => event.id === selectedEventId) ||
    invitedEvents?.find(event => event.id === selectedEventId)

  if (isEventsLoading || isInvitedEventsLoading) {
    return <CrmSpinner />
  }

  const getEventColor = event => {
    const isCreator = event.user_id === user?.id
    const isGuest = event.guests?.some(g => g.user_id === user?.id)
    const guestStatus = event.guests?.find(g => g.user_id === user?.id)?.status

    if (isCreator) {
      return {
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
        textColor: "white",
      }
    }

    if (isGuest) {
      if (guestStatus === "accepted") {
        return {
          backgroundColor: "#10B981",
          borderColor: "#059669",
          textColor: "white",
        }
      }
      if (guestStatus === "pending") {
        return {
          backgroundColor: "#F59E0B",
          borderColor: "#D97706",
          textColor: "white",
        }
      }
      if (guestStatus === "declined") {
        return {
          backgroundColor: "#EF4444",
          borderColor: "#DC2626",
          textColor: "white",
        }
      }
    }

    return EVENT_COLORS.single
  }

  const transformEvent = event => {
    return {
      id: event.id,
      title: event.title,
      start: event.start_time,
      end: event.end_time,
      allDay: false,
      ...getEventColor(event),
      extendedProps: {
        description: event.description,
        eventType: event.event_type,
        location: event.location,
        recurrenceRule: event.recurrence_rule,
        isTaskEvent: event.is_task_event,
        guests: event.guests,
        tasks: event.tasks,
        attachments: event.attachments,
        comments: event.comments,
        reminderBefore: event.reminder_before,
        userId: event.user_id,
        user: event.user,
      },
    }
  }

  // Combine and transform both created and invited events
  const allEvents = [...(events || []), ...(invitedEvents || [])]
  const calendarEvents = allEvents.map(transformEvent)

  const eventStyleGetter = event => {
    const isCreator = event.extendedProps.userId === user?.id
    const isGuest = event.extendedProps.guests?.some(
      g => g.user_id === user?.id
    )
    const guestStatus = event.extendedProps.guests?.find(
      g => g.user_id === user?.id
    )?.status

    if (isCreator) {
      return {
        style: {
          backgroundColor: "#3B82F6",
          borderColor: "#2563EB",
        },
      }
    }

    if (isGuest) {
      if (guestStatus === "accepted") {
        return {
          style: {
            backgroundColor: "#10B981",
            borderColor: "#059669",
          },
        }
      }
      if (guestStatus === "pending") {
        return {
          style: {
            backgroundColor: "#F59E0B",
            borderColor: "#D97706",
          },
        }
      }
      if (guestStatus === "declined") {
        return {
          style: {
            backgroundColor: "#EF4444",
            borderColor: "#DC2626",
          },
        }
      }
    }

    return {}
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:!text-gray-200">კალენდარი</h1>
        <button
          onClick={() => openModal("addCalendarEvent")}
          className="btn btn-primary"
        >
          დამატება
        </button>
      </div>

      <PendingInvitations />

      <div className="bg-white dark:!bg-gray-800 rounded-lg shadow p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
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
            setSelectedEventId(info.event.id)
            openModal("viewCalendarEvent")
          }}
          select={event => {
            openModal("addCalendarEvent", {
              startTime: event.startStr,
              endTime: event.endStr,
            })
          }}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          slotDuration="00:15:00"
          allDaySlot={true}
          nowIndicator={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventDisplay="block"
          eventClassNames="dark:!bg-opacity-80"
          dayCellClassNames="dark:!bg-gray-800 dark:!text-gray-200"
          slotLabelClassNames="dark:!text-gray-300"
          dayHeaderClassNames="dark:!text-gray-200"
          moreLinkClassNames="dark:!text-blue-400"
          nowIndicatorClassNames="dark:!border-red-400"
          eventPropGetter={eventStyleGetter}
        />
      </div>

      <div className="fixed z-[100]">
        <CrmDialog
          isOpen={isModalOpen("addCalendarEvent")}
          onOpenChange={open => !open && closeModal("addCalendarEvent")}
          title="ივენტის დამატება"
          description="შეავსეთ ფორმა ახალი ღონისძიების დასამატებლად"
          maxWidth="600px"
          footer={
            <>
              <DialogButton
                actionType="cancel"
                onClick={() => closeModal("addCalendarEvent")}
              >
                გაუქმება
              </DialogButton>
              <DialogButton
                actionType="add"
                type="submit"
                form="addCalendarEventForm"
              >
                დამატება
              </DialogButton>
            </>
          }
        >
          <AddCalendarEventForm
            defaultStartTime={modalParams?.startTime}
            defaultEndTime={modalParams?.endTime}
            onSuccess={() => closeModal("addCalendarEvent")}
          />
        </CrmDialog>

        <CrmDialog
          isOpen={isModalOpen("viewCalendarEvent")}
          onOpenChange={open => {
            if (!open) {
              closeModal("viewCalendarEvent")
              if (!isModalOpen("editCalendarEvent")) {
                setSelectedEventId(null)
              }
            }
          }}
          title="ივენტის დეტალები"
          maxWidth="800px"
          footer={
            <>
              <DialogButton
                actionType="cancel"
                onClick={() => {
                  closeModal("viewCalendarEvent")
                  if (!isModalOpen("editCalendarEvent")) {
                    setSelectedEventId(null)
                  }
                }}
              >
                დახურვა
              </DialogButton>
              {selectedEvent?.user_id === user?.id || isAdmin() ? (
                <DialogButton
                  actionType="edit"
                  onClick={() => {
                    closeModal("viewCalendarEvent")
                    openModal("editCalendarEvent")
                  }}
                >
                  რედაქტირება
                </DialogButton>
              ) : null}
            </>
          }
        >
          <ViewCalendarEventDetails eventId={selectedEventId} />
        </CrmDialog>

        <CrmDialog
          isOpen={isModalOpen("editCalendarEvent")}
          onOpenChange={open => {
            if (!open) {
              closeModal("editCalendarEvent")
              setSelectedEventId(null)
            }
          }}
          title="ივენტის რედაქტირება"
          description="შეასწორეთ ინფორმაცია ღონისძიების შესახებ"
          maxWidth="600px"
          footer={
            <>
              <DialogButton
                actionType="cancel"
                onClick={() => {
                  closeModal("editCalendarEvent")
                  setSelectedEventId(null)
                }}
              >
                გაუქმება
              </DialogButton>
              <DialogButton
                actionType="edit"
                type="submit"
                form="editCalendarEventForm"
              >
                განახლება
              </DialogButton>
            </>
          }
        >
          <EditCalendarEventForm
            eventId={selectedEventId}
            onSuccess={() => {
              closeModal("editCalendarEvent")
              setSelectedEventId(null)
            }}
          />
        </CrmDialog>
      </div>
    </div>
  )
}

export default Calendar
