import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardBody, Container, Row, Col } from "reactstrap"
import { useGetDepartmentHeadDaily } from "queries/daily"
import CommentThread from "./components/CommentThread"
import CommentSection from "./components/CommentSection"
import { DailyHeader } from "./components/DailyHeader"
import DailyDescription from "./components/DailyDescription"
import useAuth from "hooks/useAuth"

const DailyInner = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
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
        <Container fluid>
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">
              {error.message || "Failed to load data"}
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
              onClick={() => navigate("/tools/daily-results")}
            >
              დაბრუნება
            </button>
          </div>
        </Container>
      </div>
    )
  }

  const daily = dailyData?.daily

  return (
    <div className="page-content">
      <Container fluid>
        {daily && (
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <DailyHeader daily={daily} />
                  <DailyDescription daily={daily} />
                  <div className="mt-8">
                    <CommentSection
                      daily={dailyData?.daily}
                      canComment={true}
                    />

                    <CommentThread
                      comments={dailyData?.daily?.comments}
                      currentUserId={user?.id}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  )
}

export default DailyInner
