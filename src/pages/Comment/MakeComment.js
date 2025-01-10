import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Card,
  CardBody,
  ListGroupItem,
} from "reactstrap"
import Select from "react-select"
import { createDailyComment } from "services/dailyComment"
import { getDepartments } from "../../services/auth"

const customStyles = {
  control: provided => ({
    ...provided,
    borderRadius: "5px",
    borderColor: "#ced4da",
    boxShadow: "none",
    minHeight: "40px",
  }),
  menu: provided => ({
    ...provided,
    zIndex: 2,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#007bff" : "#fff",
    color: state.isSelected ? "#fff" : "#333",
    ":hover": {
      backgroundColor: "#e9ecef",
      color: "#333",
    },
  }),
  multiValue: provided => ({
    ...provided,
    backgroundColor: "#e9ecef",
  }),
  multiValueLabel: provided => ({
    ...provided,
    color: "#333",
  }),
  multiValueRemove: provided => ({
    ...provided,
    color: "#333",
    ":hover": {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
  }),
}

const MakeComment = () => {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [departments, setDepartments] = useState([])
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [currentPage] = useState(1)
  const commentsPerPage = 10

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getDaily(id)
        setItem(response.data)
        setComments(response.data.comments || [])
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchItem()

    const fetchDepartments = async () => {
      try {
        const response = await getDepartments()
        setDepartments(
          Array.isArray(response.data.departments)
            ? response.data.departments
            : []
        )
      } catch (error) {
        console.error("Failed to fetch departments:", error)
        setDepartments([])
      }
    }

    fetchDepartments()
  }, [id])

  const userId = 1

  useEffect(() => {
    if (window.Echo) {
      const channel = window.Echo.channel(`user.${userId}`)
      channel.listen("ReplyMade", () => {
      })

      return () => {
        window.Echo.leave(`user.${userId}`)
      }
    }
  }, [userId])

  const handleCommentChange = e => {
    setNewComment(e.target.value)
  }

  const handleDepartmentsChange = selectedOptions => {
    setSelectedDepartments(selectedOptions)
  }

  const handleCommentSubmit = async e => {
    e.preventDefault()

    if (!newComment.trim()) {
      return
    }

    try {
      const response = await createDailyComment({
        comment: newComment,
        daily_id: id,
        parent_id: replyTo,
        user_id: 1,
        departments: selectedDepartments.map(dept => dept.value),
      })
      const savedComment = response.data

      if (replyTo) {
        setComments(prevComments =>
          addReplyToComment(prevComments, savedComment)
        )
      } else {
        setComments([...comments, savedComment])
      }

      setNewComment("")
      setReplyTo(null)
      setSelectedDepartments([])
    } catch (error) {
      console.error("Error submitting comment:", error)
      setError("Failed to submit comment")
    }
  }

  const addReplyToComment = (commentList, savedReply) => {
    return commentList.map(comment => {
      if (comment.id === savedReply.parent_id) {
        return {
          ...comment,
          replies: [...(comment.replies || []), savedReply],
        }
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, savedReply),
        }
      }
      return comment
    })
  }

  const paginate = commentsList => {
    const startIndex = (currentPage - 1) * commentsPerPage
    const endIndex = startIndex + commentsPerPage
    return commentsList.slice(startIndex, endIndex)
  }

  const renderComments = (commentsList, parentId = null) => {
    const paginatedComments = paginate(commentsList)

    return paginatedComments
      .filter(comment => comment.parent_id === parentId)
      .map(comment => (
        <div
          key={comment.id}
          style={{
            marginLeft: parentId ? "20px" : "0",
            borderLeft: parentId ? "2px solid #ddd" : "none",
            paddingLeft: parentId ? "15px" : "0",
            marginBottom: "10px",
          }}
        >
          <ListGroupItem className="border border-light p-3 mb-2 bg-light rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">
                <strong>თარიღი:</strong>{" "}
                {new Date(comment.created_at).toLocaleString()}
              </small>
              <small className="text-muted">
                <strong>სახელი / გვარი:</strong> {comment.user?.name} /{" "}
                {comment.user?.sur_name}
              </small>
            </div>
            <p className="mb-0">{comment.comment}</p>
            <Button
              size="sm"
              color="link"
              className="text-primary p-0"
              onClick={() => setReplyTo(comment.id)}
            >
              პასუხი
            </Button>
          </ListGroupItem>
          {renderComments(comment.replies || [], comment.id)}
        </div>
      ))
  }

  const adminComments = comments.filter(comment => comment.user_id === 1)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="container-fluid mt-4">
      <Row style={{ paddingTop: "60px" }}>
        <Col md={8}>
          <Card className="mb-4 shadow border-0">
            <CardBody className="p-5">
              <h3 className="text-dark mb-4">დღის საკითხის აღწერა</h3>
              <p className="lead text-muted" style={{ whiteSpace: "pre-wrap" }}>
                {item?.description}
              </p>
            </CardBody>
          </Card>

          <h4 className="text-dark mb-3">
            {replyTo ? "პასუხი კომენტარზე" : "კომენტარის დამატება"}
          </h4>
          <Form
            onSubmit={handleCommentSubmit}
            className="mb-4 pb-5 shadow-sm p-4 bg-white rounded"
          >
            <FormGroup row className="mb-3">
              <Label for="comment" sm={2} className="col-form-label">
                კომენტარი
              </Label>
              <Col sm={10}>
                <Input
                  type="textarea"
                  name="comment"
                  id="comment"
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="დაწერეთ თქვენი კომენტარი აქ..."
                  required
                  style={{ height: "120px", borderColor: "#ced4da" }}
                  className="border-0 shadow-sm"
                />
              </Col>
            </FormGroup>

            <FormGroup row className="mb-3">
              <Label for="departments" sm={2} className="col-form-label">
                დეპარტამენტის მიბმა
              </Label>
              <Col sm={10}>
                <Select
                  isMulti
                  name="departments"
                  options={
                    Array.isArray(departments)
                      ? departments.map(dept => ({
                          value: dept.id,
                          label: dept.name,
                        }))
                      : []
                  }
                  value={selectedDepartments}
                  onChange={handleDepartmentsChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="აირჩიეთ დეპარტამენტი..."
                  styles={customStyles}
                />
              </Col>
            </FormGroup>

            <Row className="justify-content-end">
              <Col sm={10} className="text-right">
                <Button color="success" type="submit" className="shadow-sm">
                  გაგზავნა
                </Button>
                {replyTo && (
                  <Button
                    color="secondary"
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="ml-2 shadow-sm"
                  >
                    გაუქმება
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Col>

        <Col md={4}>
          <Card
            className="mb-4 shadow"
            style={{ height: "80vh", overflowY: "auto" }}
          >
            {" "}
            {/* Scrollable section */}
            <CardBody>
              <h5 className="text-center text-primary mb-4">
                დამფუძნებლის კომენტარი
              </h5>
              {adminComments.length > 0 ? (
                adminComments.map(comment => (
                  <Card
                    key={comment.id}
                    className="mb-3 border border-primary shadow-sm"
                  >
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="text-primary">
                          <i className="fas fa-user-shield me-2"></i> Gia
                          Gorgoshadze
                        </strong>
                        <span className="badge bg-primary text-white">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mb-1">{comment.comment}</p>
                      <div className="text-end">
                        <small className="text-muted">
                          {new Date(comment.created_at).toLocaleTimeString()}
                        </small>
                      </div>
                      <Button
                        size="sm"
                        color="link"
                        className="text-primary p-0"
                        onClick={() => setReplyTo(comment.id)}
                      >
                        პასუხი
                      </Button>
                      {renderComments(comment.replies || [], comment.id)}
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="text-muted">
                  დამფუძნებელს ამ საკითხზე ჯერ კომენტარი არ გაუკეთებია...
                </p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default MakeComment
