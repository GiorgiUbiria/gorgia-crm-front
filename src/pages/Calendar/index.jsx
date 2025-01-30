import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import kaLocale from "@fullcalendar/core/locales/ka"

import { useGetCalendarEvents } from "queries/calendar"
import CrmSpinner from "components/CrmSpinner"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import useModalStore from "store/zustand/modalStore"
import { AddCalendarEventForm } from "./components/add"
import { EditCalendarEventForm } from "./components/edit"

const Calendar = () => {
  const { data: events, isLoading: isEventsLoading } = useGetCalendarEvents()
  const { isModalOpen, closeModal, openModal, modalParams } = useModalStore()
  console.log(events)

  if (isEventsLoading) {
    return <CrmSpinner />
  }

  return (
    <div className="w-full min-h-screen relative z-0">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 sm:p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events?.map(event => ({
                id: event.id,
                title: event.title,
                start: event.start_time,
                end: event.end_time,
                extendedProps: {
                  description: event.description,
                  eventType: event.event_type,
                  location: event.location,
                  recurrenceRule: event.recurrence_rule,
                  isTaskEvent: event.is_task_event,
                  guests: event.guests,
                  tasks: event.tasks
                }
              }))}
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
              eventClick={(info) => {
                openModal("editCalendarEvent", { id: info.event.id })
              }}
              select={event => {
                openModal("addCalendarEvent", event)
              }}
              eventDataTransform={eventData => ({
                id: eventData.id,
                title: eventData.title,
                start: eventData.start_time,
                end: eventData.end_time,
                allDay: false,
                extendedProps: {
                  description: eventData.description,
                  eventType: eventData.event_type,
                  location: eventData.location,
                  recurrenceRule: eventData.recurrence_rule,
                  isTaskEvent: eventData.is_task_event,
                  guests: eventData.guests,
                  tasks: eventData.tasks
                }
              })}
            />
          </div>
        </div>
      </div>

      <div className="fixed z-[100]">
        <CrmDialog
          isOpen={isModalOpen("addCalendarEvent")}
          onOpenChange={open => !open && closeModal("addCalendarEvent")}
          title="ივენტის დამატება"
          description="შეავსეთ ფორმა ახალი ღონისძიების დასამატებლად"
          footer={
            <>
              <DialogButton
                actionType="cancel"
                onClick={() => closeModal("addCalendarEvent")}
              >
                გაუქმება
              </DialogButton>
              <DialogButton actionType="add" type="submit" form="addCalendarEventForm">
                დამატება
              </DialogButton>
            </>
          }
        >
          <AddCalendarEventForm onSuccess={() => closeModal("addCalendarEvent")} /> 
        </CrmDialog>

        <CrmDialog
          isOpen={isModalOpen("editCalendarEvent")}
          onOpenChange={open => !open && closeModal("editCalendarEvent")}
          title="ივენტის რედაქტირება"
          description="შეასწორეთ ინფორმაცია ღონისძიების შესახებ"
          footer={
            <>
              <DialogButton
                actionType="cancel"
                onClick={() => closeModal("editCalendarEvent")}
              >
                გაუქმება
              </DialogButton>
              <DialogButton actionType="edit" type="submit" form="editCalendarEventForm">
                განახლება
              </DialogButton>
            </>
          }
        >
          <EditCalendarEventForm 
            eventId={modalParams?.id} 
            onSuccess={() => closeModal("editCalendarEvent")} 
          />
        </CrmDialog>
      </div>
    </div>
  )
}

export default Calendar
