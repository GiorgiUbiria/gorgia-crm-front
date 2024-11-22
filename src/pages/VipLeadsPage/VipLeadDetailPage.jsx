import React, { useState, useEffect, useCallback } from 'react';
import { getAllLeadRequests } from '../../services/vipLeadRequestsService';
import { Card, CardBody, Container, Table, Input, Button, Collapse } from 'reactstrap';
import moment from 'moment';
import Comment from '../../components/Comment';
import { useComments } from '../../hooks/useComments';
import useFetchUser from '../../hooks/useFetchUser';

const VipLeadDetailPage = () => {
  const [requests, setRequests] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [newComments, setNewComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { comments, isLoading: commentsLoading, error, fetchComments, addComment, deleteComment } = useComments();
  const { user: currentUser } = useFetchUser();

  console.log('Current User:', currentUser);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data } = await getAllLeadRequests();
      setRequests(data.data || data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRow = useCallback(async (requestId) => {
    setExpandedRows(prev => {
      const isExpanding = !prev[requestId];
      if (isExpanding && !comments[requestId]) {
        fetchComments(requestId);
      }
      return { ...prev, [requestId]: !prev[requestId] };
    });
  }, [comments, fetchComments]);

  const handleAddComment = useCallback(async (requestId, commentText, parentId = null) => {
    try {
      const success = await addComment(requestId, commentText, parentId);
      if (success && !parentId) {
        setNewComments(prev => ({ ...prev, [requestId]: '' }));
      }
      return success;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  }, [addComment]);

  const handleDeleteComment = useCallback(async (requestId, commentId) => {
    try {
      const success = await deleteComment(requestId, commentId);
      if (!success) {
        console.error('Failed to delete comment');
      }
      return success;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }, [deleteComment]);

  const handleMainInputFocus = useCallback(() => {
    // Only close reply inputs when focusing on the main comment input
    const allReplyInputs = document.querySelectorAll('.reply-input');
    allReplyInputs.forEach(input => {
      const container = input.closest('.comment-container');
      if (container) {
        const commentComponent = container.__reactFiber$; // This is not recommended but works
        if (commentComponent && commentComponent.stateNode) {
          commentComponent.stateNode.setIsReplying(false);
        }
      }
    });
  }, []);

  if (isLoading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <Container fluid className="mt-3">
      <Card className="shadow-sm">
        <CardBody className="p-3">
          <h4 className="text-primary mb-3">მოთხოვნების სია</h4>
          
          <Table hover responsive size="sm" className="mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>სახელი</th>
                <th>სტატუსი</th>
                <th>შექმნის თარიღი</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <React.Fragment key={request.id}>
                  <tr onClick={() => toggleRow(request.id)} style={{ cursor: 'pointer' }}>
                    <td>{request.id}</td>
                    <td>{request.name}</td>
                    <td>{request.request_status}</td>
                    <td>{moment(request.created_at).format('YYYY-MM-DD HH:mm')}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="p-0">
                      <Collapse isOpen={expandedRows[request.id]}>
                        <div className="p-2 bg-light">
                          {/* Comments section */}
                          {(comments[request.id] || []).map(comment => (
                            <Comment
                              key={comment.id}
                              comment={comment}
                              requestId={request.id}
                              onReply={handleAddComment}
                              onDelete={handleDeleteComment}
                              onMainInputFocus={handleMainInputFocus}
                              currentUser={currentUser}
                            />
                          ))}
                          
                          {/* New comment input */}
                          <div className="mt-2">
                            <Input
                              type="textarea"
                              placeholder="დაამატეთ ახალი კომენტარი..."
                              value={newComments[request.id] || ''}
                              onChange={e => setNewComments(prev => ({
                                ...prev,
                                [request.id]: e.target.value
                              }))}
                              className="mb-1"
                              onClick={e => e.stopPropagation()}
                              onFocus={handleMainInputFocus}
                              rows={1}
                              bsSize="sm"
                            />
                            <Button
                              color="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddComment(request.id, newComments[request.id]);
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
        </CardBody>
      </Card>
    </Container>
  );
};

export default VipLeadDetailPage;
