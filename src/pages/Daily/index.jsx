import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardBody, Container, Row, Col, Form, Button } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import { getDepartmentHeadDaily } from "services/daily"
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
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [dailyResponse, departmentsResponse] = await Promise.all([
          getDepartmentHeadDaily(id),
          getPublicDepartments(),
        ])
        setDaily(dailyResponse.daily)
        const departmentsArray = Array.isArray(departmentsResponse.data)
          ? departmentsResponse.data
          : departmentsResponse.data?.data || []
        setDepartments(departmentsArray)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleCommentSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!comment.trim()) return

      try {
        const response = await createDailyComment({
          daily_id: id,
          comment,
          parent_id: replyTo?.id || null,
        })
        const newComment = response.data
        setComment("")
        setReplyTo(null)
        setDaily((prevDaily) => {
          if (!prevDaily) return prevDaily

          if (replyTo) {
            const updatedComments = prevDaily.comments.map((c) =>
              c.id === replyTo.id
                ? {
                    ...c,
                    replies: [...(c.replies || []), newComment],
                  }
                : {
                    ...c,
                    replies: c.replies ? c.replies.map((r) => r.id === replyTo.id ? { ...r, replies: [...(r.replies || []), newComment] } : r) : [],
                  }
            )
            return { ...prevDaily, comments: updatedComments }
          }

          return {
            ...prevDaily,
            comments: [...(prevDaily.comments || []), newComment],
          }
        })
      } catch (err) {
        console.error("Error adding comment:", err)
        setError("Failed to add comment. Please try again.")
      }
    },
    [comment, replyTo, id]
  )

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("ka-GE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  const handleReply = useCallback((comment) => {
    setReplyTo(comment)
    document.getElementById("commentInput")?.focus()
  }, [])

  const renderComment = useCallback(
    (comment, level = 0) => (
      <CommentItem
        key={comment.id}
        comment={comment}
        level={level}
        handleReply={handleReply}
        formatDate={formatDate}
        renderComment={renderComment}
      />
    ),
    [handleReply, formatDate]
  )

  const memoizedDepartments = useMemo(
    () => {
      console.log("departments in useMemo:", departments);
      return departments.map((dept) => ({
        id: dept.id,
        display: dept.name,
        type: "department",
      }))
    },
    [departments]
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

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">
            <h3 className="text-danger">{error}</h3>
            <Button color="primary" onClick={() => navigate("/tools/daily-results")}>
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
        <Breadcrumbs title="დღიური შეფასება" breadcrumbItem={daily?.name || ""} />

        {daily && (
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <DailyHeader daily={daily} formatDate={formatDate} />
                  <DailyContent daily={daily} />
                  <CommentsSection
                    daily={daily}
                    comment={comment}
                    setComment={setComment}
                    handleCommentSubmit={handleCommentSubmit}
                    replyTo={replyTo}
                    setReplyTo={setReplyTo}
                    renderComment={renderComment}
                    memoizedDepartments={memoizedDepartments}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  )
}

const DailyHeader = React.memo(({ daily, formatDate }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h4 className="card-title mb-1">{daily.name}</h4>
      <small className="text-muted d-block">შეიქმნა: {formatDate(daily.date)}</small>
    </div>
    <div className="d-flex align-items-center">
      <Chip
        avatar={<Avatar>{daily.user?.name?.[0]}</Avatar>}
        label={`${daily.user?.name} ${daily.user?.sur_name}`}
        variant="outlined"
        className="me-2"
      />
      <Chip label={daily.department?.name} color="primary" variant="outlined" />
    </div>
  </div>
))
DailyHeader.displayName = "DailyHeader"

const DailyContent = React.memo(({ daily }) => (
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
          მიმითებული ფაილი
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
))
DailyContent.displayName = "DailyContent"

const CommentsSection = React.memo(
  ({
    daily,
    comment,
    setComment,
    handleCommentSubmit,
    replyTo,
    setReplyTo,
    renderComment,
    memoizedDepartments,
  }) => (
    <div className="comments-section mt-5">
      <h5 className="mb-4">
        კომენტარები <span className="text-muted">({daily.comments?.length || 0})</span>
      </h5>

      <Form onSubmit={handleCommentSubmit} className="mb-4">
        {replyTo && (
          <div className="reply-badge mb-2 p-2 bg-light rounded d-flex align-items-center">
            <small className="text-muted me-2">
              <i className="bx bx-reply-all me-1"></i>
              პასუხი:{" "}
              <strong>
                {replyTo.user?.name} {replyTo.user?.sur_name}
              </strong>
            </small>
            <Button close size="sm" onClick={() => setReplyTo(null)} />
          </div>
        )}
        <div className="comment-input-wrapper bg-light rounded p-3">
          <MentionsInput
            id="commentInput"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={replyTo ? "დაწერეთ პასუხი..." : "დაწერეთ კომენტარი..."}
            mentions={memoizedDepartments}
          />
          <div className="text-end mt-3">
            {replyTo && (
              <Button color="light" className="me-2" onClick={() => setReplyTo(null)}>
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
            .filter((comment) => !comment.parent_id)
            .map((comment) => renderComment(comment))}
      </div>
    </div>
  )
)
CommentsSection.displayName = "CommentsSection"

const CommentItem = React.memo(
  ({ comment, isReply, handleReply, formatDate, renderComment, level = 0 }) => (
    <div
      className={`comment-item mb-3 ${isReply ? "ps-5" : ""}`}
      style={{ marginLeft: level * 20 }}
    >
      <div className="bg-light rounded p-3 position-relative">
        {level > 0 && (
          <div
            className="position-absolute top-0 start-0 h-100 border-start border-secondary"
            style={{ left: -10, width: 2 }}
          ></div>
        )}
        <div className="d-flex align-items-start">
          <Avatar
            src={comment.user?.profile_image}
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
                    <Chip label={comment.department.name} size="small" className="ms-2" />
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
          {comment.replies.map((reply) => renderComment(reply, level + 1))}
        </div>
      )}
    </div>
  )
)
CommentItem.displayName = "CommentItem"

export default Daily
