import React, { useState, useEffect, useCallback } from "react"
import { getAllLeadRequests } from "../../services/vipLeadRequestsService"
import {
  Card,
  CardBody,
  Container,
  Table,
  Input,
  Button,
  Collapse,
} from "reactstrap"
import { useComments } from "../../hooks/useComments"

const STATUS_CONFIG = {
  PENDING: {
    color: "warning",
    label: "მოლოდინში",
  },
  IN_PROGRESS: {
    color: "info",
    label: "მიმდინარე",
  },
  COMPLETED: {
    color: "success",
    label: "დასრულებული",
  },
  REJECTED: {
    color: "danger",
    label: "უარყოფილი",
  },
}

const VipLeadDetailPage = () => {
  const [requests, setRequests] = useState([])
  const [expandedRows, setExpandedRows] = useState({})
  const [newComments, setNewComments] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { comments, fetchComments, addComment } = useComments()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const { data } = await getAllLeadRequests()
      setRequests(data.data || data)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRow = useCallback(
    async requestId => {
      setExpandedRows(prev => {
        const isExpanding = !prev[requestId]
        if (isExpanding && !comments[requestId]) {
          fetchComments(requestId)
        }
        return { ...prev, [requestId]: !prev[requestId] }
      })
    },
    [comments, fetchComments]
  )

  const handleAddComment = useCallback(
    async (requestId, commentText, parentId = null) => {
      try {
        const success = await addComment(requestId, commentText, parentId)
        if (success && !parentId) {
          setNewComments(prev => ({ ...prev, [requestId]: "" }))
        }
        return success
      } catch (error) {
        console.error("Error adding comment:", error)
        return false
      }
    },
    [addComment]
  )

  const handleMainInputFocus = useCallback(() => {
    const allReplyInputs = document.querySelectorAll(".reply-input")
    allReplyInputs.forEach(input => {
      const container = input.closest(".comment-container")
      if (container) {
        const commentComponent = container.__reactFiber$
        if (commentComponent && commentComponent.stateNode) {
          commentComponent.stateNode.setIsReplying(false)
        }
      }
    })
  }, [])

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <div className="text-center mt-4">Loading...</div>
  }

  return (
    <div className="page-content">
      <Container fluid className="mt-3">
        <Card className="shadow-sm">
          <CardBody className="p-3">
            <h4 className="text-primary mb-3">VIP მოთხოვნების სია</h4>
            <Input
              type="search"
              placeholder="ძებნა სახელით..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-3"
              bsSize="sm"
            />
            <Table hover responsive size="sm" className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>სახელი გვარი</th>
                  <th>სტატუსი</th>
                  <th>შექმნის თარიღი</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <React.Fragment key={request.id}>
                    <tr
                      onClick={() => toggleRow(request.id)}
                      style={{ cursor: "pointer" }}
                      className={expandedRows[request.id] ? "table-active" : ""}
                      key={`row-${request.id}`}
                    >
                      <td className="fw-medium">#{request.id}</td>
                      <td>{request.name}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            STATUS_CONFIG[request.request_status]?.color ||
                            "secondary"
                          } rounded-pill`}
                        >
                          {STATUS_CONFIG[request.request_status]?.label ||
                            request.request_status}
                        </span>
                      </td>
                      <td>
                        {moment(request.creation_date).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </td>
                    </tr>
                    <tr key={`collapse-${request.id}`}>
                      <td colSpan="4" className="p-0">
                        <Collapse isOpen={expandedRows[request.id]}>
                          <div className="p-2 bg-light">
                            {(comments[request.id] || []).map(comment => (
                              <div key={comment.id}>
                                {JSON.stringify(comment)}
                              </div>
                            ))}
                            <div className="mt-2">
                              <Input
                                type="textarea"
                                placeholder="დაამატეთ ახალი კომენტარი..."
                                value={newComments[request.id] || ""}
                                onChange={e =>
                                  setNewComments(prev => ({
                                    ...prev,
                                    [request.id]: e.target.value,
                                  }))
                                }
                                className="mb-1"
                                onClick={e => e.stopPropagation()}
                                onFocus={handleMainInputFocus}
                                rows={1}
                                bsSize="sm"
                              />
                              <Button
                                color="primary"
                                size="sm"
                                onClick={e => {
                                  e.stopPropagation()
                                  handleAddComment(
                                    request.id,
                                    newComments[request.id]
                                  )
                                }}
                              >
                                დამატება
                              </Button>
                            </div>
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
            {filteredRequests.length === 0 && (
              <div className="text-center text-muted py-4">
                მოთხოვნები ვერ მოიძებნა
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  )
}

export default VipLeadDetailPage
