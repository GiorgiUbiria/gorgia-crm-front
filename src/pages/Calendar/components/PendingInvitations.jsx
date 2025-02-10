import React from "react"
import { format } from "date-fns"
import { ka } from "date-fns/locale"
import { useGetInvitedEvents, useUpdateGuestStatus } from "queries/calendar"
import { Clock, User, Check, X } from "lucide-react"
import CrmSpinner from "components/CrmSpinner"
import useAuth from "hooks/useAuth"

const formatDateTime = date => {
  if (!date) return ""
  return format(new Date(date), "d MMMM yyyy, HH:mm", { locale: ka })
}

export const PendingInvitations = () => {
  const { data: invitedEvents, isLoading } = useGetInvitedEvents()
  const updateStatusMutation = useUpdateGuestStatus()
  const { user } = useAuth()

  const handleStatusUpdate = async (eventId, status) => {
    try {
      await updateStatusMutation.mutateAsync({ eventId, status })
    } catch (error) {
      console.error("Error updating invitation status:", error)
    }
  }

  if (isLoading) {
    return <CrmSpinner />
  }

  const pendingInvitations = invitedEvents?.filter(event => {
    const currentUserGuest = event.guests?.find(g => g.user_id === user?.id)
    return currentUserGuest?.status === "pending"
  }) || []

  if (pendingInvitations.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4 dark:!text-gray-200">
        მოწვევები ({pendingInvitations.length})
      </h3>
      <div className="space-y-3">
        {pendingInvitations.map(event => (
          <div
            key={event.id}
            className="p-4 bg-yellow-50 dark:!bg-yellow-900/20 rounded-lg border border-yellow-200 dark:!border-yellow-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-yellow-900 dark:!text-yellow-200">
                  {event.title}
                </h4>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-yellow-700 dark:!text-yellow-300">
                    <Clock className="w-4 h-4" />
                    <span>{formatDateTime(event.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-yellow-700 dark:!text-yellow-300">
                    <User className="w-4 h-4" />
                    <span>{event.user?.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusUpdate(event.id, "accepted")}
                  disabled={updateStatusMutation.isLoading}
                  className="p-2 text-green-600 hover:text-green-700 dark:!text-green-400 dark:hover:!text-green-300"
                  title="დათანხმება"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleStatusUpdate(event.id, "declined")}
                  disabled={updateStatusMutation.isLoading}
                  className="p-2 text-red-600 hover:text-red-700 dark:!text-red-400 dark:hover:!text-red-300"
                  title="უარყოფა"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 