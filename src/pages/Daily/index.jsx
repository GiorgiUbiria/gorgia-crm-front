import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardBody, Container, Row, Col, Form, Button } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import { getDaily } from "services/daily"
import { getPublicDepartments } from "services/admin/department"
import { createDailyComment } from "services/dailyComment"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import MentionsInput from "components/Common/MentionsInput"

const Daily = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [daily, setDaily] = useState(null)
  const [departments, setDepartments] = useState([])
  const [comment, setComment] = useState("")
  const [replyTo, setReplyTo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDaily()
    fetchDepartments()
  }, [id])

  const fetchDaily = async () => {
    try {
      setLoading(true)
      const response = await getDaily(id)
      setDaily(response.data)
    } catch (error) {
      console.error("Error fetching daily:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await getPublicDepartments()
      const departmentsArray = Array.isArray(response.data)
        ? response.data
        : response.data?.departments || []
      setDepartments(departmentsArray)
    } catch (error) {
      console.error("Error fetching departments:", error)
      setDepartments([])
    }
  }

  const handleCommentSubmit = async e => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      await createDailyComment({
        daily_id: id,
        comment,
        parent_id: replyTo?.id,
      })
      setComment("")
      setReplyTo(null)
      fetchDaily()
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("ka-GE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleReply = comment => {
    setReplyTo(comment)
    document.getElementById("commentInput")?.focus()
  }

  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      className={`comment-item mb-3 ${isReply ? "ps-5" : ""}`}
    >
      <div className="bg-light rounded p-3">
        <div className="d-flex align-items-start">
          <Avatar
            src={comment.user?.avatar}
            alt={comment.user?.name}
            className="me-2"
            sx={{ width: 32, height: 32 }}
          >
            {comment.user?.name?.[0]}
          </Avatar>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 d-flex align-items-center">
                  <span className="me-2">
                    {comment.user?.name} {comment.user?.sur_name}
                  </span>
                  {comment.department && (
                    <Chip
                      label={comment.department.name}
                      size="small"
                      className="ms-2"
                    />
                  )}
                </h6>
                <small className="text-muted d-block">
                  {formatDate(comment.created_at)}
                </small>
              </div>
              <Button
                color="link"
                className="p-0 text-primary"
                onClick={() => handleReply(comment)}
              >
                <i className="bx bx-reply me-1"></i>
                პასუხი
              </Button>
            </div>
            <p className="mt-2 mb-0">{comment.comment}</p>
          </div>
        </div>
      </div>
      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="replies-container mt-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (!daily) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">
            <h3>Daily task not found</h3>
            <Button
              color="primary"
              onClick={() => navigate("/tools/daily-results")}
            >
              დაბრუნება
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="დღიური შეფასება" breadcrumbItem={daily.name} />

        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="card-title mb-1">{daily.name}</h4>
                    <small className="text-muted d-block">
                      შექმნილია: {formatDate(daily.created_at)}
                    </small>
                  </div>
                  <div className="d-flex align-items-center">
                    <Chip
                      avatar={<Avatar>{daily.user?.name?.[0]}</Avatar>}
                      label={`${daily.user?.name} ${daily.user?.sur_name}`}
                      variant="outlined"
                      className="me-2"
                    />
                    <Chip
                      label={daily.user?.department?.name}
                      color="primary"
                      variant="outlined"
                    />
                  </div>
                </div>

                <div className="daily-content mb-4">
                  <p className="mb-3">{daily.description}</p>
                  {daily.attachment && (
                    <div className="mb-2">
                      <a
                        href={`/storage/${daily.attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-light"
                      >
                        <i className="bx bx-file me-1"></i>
                        მიმაგრებული ფაილი
                      </a>
                    </div>
                  )}
                  {daily.link && (
                    <div>
                      <a
                        href={daily.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        <i className="bx bx-link-external me-1"></i>
                        დაკავშირებული ბმული
                      </a>
                    </div>
                  )}
                </div>

                <div className="comments-section mt-5">
                  <h5 className="mb-4">
                    კომენტარები{" "}
                    <span className="text-muted">
                      ({daily.comments?.length || 0})
                    </span>
                  </h5>

                  <Form onSubmit={handleCommentSubmit} className="mb-4">
                    {replyTo && (
                      <div className="reply-badge mb-2 p-2 bg-light rounded d-flex align-items-center">
                        <small className="text-muted me-2">
                          <i className="bx bx-reply-all me-1"></i>
                          პასუხი: <strong>{replyTo.user?.name} {replyTo.user?.sur_name}</strong>
                        </small>
                        <Button
                          close
                          size="sm"
                          onClick={() => setReplyTo(null)}
                        />
                      </div>
                    )}
                    <div className="comment-input-wrapper bg-light rounded p-3">
                      <MentionsInput
                        id="commentInput"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={
                          replyTo
                            ? "დაწერეთ პასუხი..."
                            : "დაწერეთ კომენტარი..."
                        }
                        mentions={departments.map(dept => ({
                          id: dept.id,
                          display: dept.name,
                          type: 'department'
                        }))}
                      />
                      <div className="text-end mt-3">
                        {replyTo && (
                          <Button
                            color="light"
                            className="me-2"
                            onClick={() => setReplyTo(null)}
                          >
                            გაუქმება
                          </Button>
                        )}
                        <Button color="primary" type="submit" disabled={!comment.trim()}>
                          {replyTo ? "პასუხის გაგზავნა" : "კომენტარის დამატება"}
                        </Button>
                      </div>
                    </div>
                  </Form>

                  <div className="comments-list">
                    {Array.isArray(daily.comments) &&
                      daily.comments
                        .filter(comment => !comment.parent_id)
                        .map(comment => renderComment(comment))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Daily
