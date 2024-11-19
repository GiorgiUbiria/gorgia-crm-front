import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCommentsForVipLead, addCommentToVipLead, getVipLeadById } from '../../services/vipLeadsService';
import { Card, CardBody, Col, Container, Row, Label, Input, Form, Button } from 'reactstrap';
import moment from 'moment'; // For formatting date

const VipLeadDetailPage = () => {
  const { id } = useParams(); // Get the VIP lead ID from the URL
  const [vipLead, setVipLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch VIP lead details and comments
    const fetchVipLeadData = async () => {
      try {
        const leadData = await getVipLeadById(id); // Implement getVipLeadById in your services
        setVipLead(leadData);

        const commentsData = await fetchCommentsForVipLead(id);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching VIP lead details:', error);
      }
    };

    fetchVipLeadData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await addCommentToVipLead(id, newComment);
      setNewComment(''); // Clear the input field
      const updatedComments = await fetchCommentsForVipLead(id); // Fetch updated comments
      setComments(updatedComments); // Update the comments list
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!vipLead) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <Container fluid>
      <Row className="justify-content-center" style={{ marginTop: '70px' }}>
        <Col lg="10">
          <Card className="mb-4 shadow-sm">
            <CardBody>
              <h3 className="text-primary mb-4">ლიდის შიდა გვერდი</h3>
              <Row>
                <Col md="6">
                  <p><strong>სახელი:</strong> {vipLead.first_name} {vipLead.last_name}</p>
                  <p><strong>მოთხოვნა:</strong> {vipLead.request}</p>
                  <p><strong>სტატუსი:</strong> <span className={`badge ${vipLead.status === 'Closed' ? 'bg-success' : 'bg-warning'}`}>{vipLead.status}</span></p>
                </Col>
                <Col md="6">
                  <p><strong>პასუხისმგებელი პირი:</strong> {vipLead.responsible_person}</p>
                  <p><strong>კომენტარი:</strong> {vipLead.comment}</p>
                </Col>
              </Row>

              <h4 className="mt-4 mb-4">კომენტარები</h4>
              <div className="comment-section">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <Card key={index} className="mb-3 border-0 shadow-sm">
                      <CardBody className="bg-light">
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>
                              {comment.user ? `${comment.user.name} ${comment.user.sur_name}` : 'Unknown User'}
                            </strong> {/* Check if the user object exists */}
                            <p className="mb-0">{comment.comment}</p> {/* Comment text */}
                          </div>
                          <small className="text-muted">
                            {moment(comment.created_at).format('YYYY-MM-DD HH:mm')}
                          </small> {/* Display comment creation date */}
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted">არ არის კომენტარი.</p>
                )}
              </div>

              <Form onSubmit={handleAddComment}>
                <Label for="newComment" className="mt-4">კომენტარის დამატება</Label>
                <Input
                  id="newComment"
                  name="newComment"
                  type="textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="mb-3"
                  style={{ minHeight: '100px' }}
                />
                <Button color="primary" type="submit" className="float-end">
                 დამატება
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VipLeadDetailPage;
