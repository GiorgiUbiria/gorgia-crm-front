import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useGetDepartmentHeadDaily } from "queries/daily"
import CommentThread from "./components/CommentThread"
import CommentSection from "./components/CommentSection"
import { DailyHeader } from "./components/DailyHeader"
import DailyDescription from "./components/DailyDescription"
import useCurrentUser from "hooks/useCurrentUser"

const Daily = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const {
    data: dailyData,
    isLoading,
    error,
  } = useGetDepartmentHeadDaily(id, {
    staleTime: 30000,
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:!border-primary-light"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500 dark:!text-red-400 text-lg mb-4">
              {error.message || "Failed to load data"}
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark dark:!bg-primary-light dark:!hover:bg-primary"
              onClick={() => navigate("/tools/daily-results")}
            >
              დაბრუნება
            </button>
          </div>
        </div>
      </div>
    )
  }

  const daily = dailyData?.daily

  return (
    <div className="container mx-auto px-4">
      {daily && (
        <div className="w-full">
          <div className="bg-white dark:!bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6">
              <DailyHeader daily={daily} />
              <DailyDescription daily={daily} />
              <div className="mt-8">
                <CommentSection daily={dailyData?.daily} canComment={true} />

                <CommentThread
                  comments={dailyData?.daily?.comments}
                  currentUserId={currentUser?.id}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Daily
