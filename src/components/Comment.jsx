import React, { useState, useCallback, memo, useEffect } from 'react';
import { Button, Input } from 'reactstrap';
import moment from 'moment';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const Comment = memo(function Comment({ 
  comment, 
  requestId, 
  onReply, 
  onDelete, 
  onMainInputFocus, 
  currentUser,
  depth = 0 
}) {
  console.log('Current User:', currentUser);
  console.log('Comment User:', comment.user);
  
  const canDelete = currentUser?.id === comment.user_id;

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showDeepReplies, setShowDeepReplies] = useState(false);
  const [deepReplies, setDeepReplies] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleReply = useCallback(async (e) => {
    e.stopPropagation();
    if (!replyText.trim()) return;
    
    try {
      const success = await onReply(requestId, replyText, comment.id);
      if (success) {
        setReplyText('');
        setIsReplying(false);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  }, [replyText, requestId, comment.id, onReply]);

  useEffect(() => {
    return () => {
      if (isReplying) {
        setIsReplying(false);
        setReplyText('');
      }
    };
  }, [isReplying]);

  const loadDeepReplies = async () => {
    try {
      const response = await fetchCommentsForLeadRequest(requestId, comment.id);
      setDeepReplies(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error('Error loading deep replies:', error);
    }
  };

  const renderReplies = () => {
    if (comment.replies?.length > 0) {
      return comment.replies.map(reply => (
        <Comment
          key={reply.id}
          comment={reply}
          requestId={requestId}
          onReply={onReply}
          onDelete={onDelete}
          onMainInputFocus={onMainInputFocus}
          currentUser={currentUser}
          depth={depth + 1}
        />
      ));
    }
    return null;
  };

  const renderDeepRepliesControl = () => {
    if (depth === 1 && comment.has_deep_replies) {
      return (
        <Button
          size="sm"
          color="link"
          className="p-0 mb-2"
          onClick={async (e) => {
            e.stopPropagation();
            if (!showDeepReplies && deepReplies.length === 0) {
              await loadDeepReplies();
            }
            setShowDeepReplies(!showDeepReplies);
          }}
        >
          {showDeepReplies ? (
            <>
              <i className="fas fa-chevron-up me-1"></i>
              დამალვა
            </>
          ) : (
            <>
              <i className="fas fa-chevron-down me-1"></i>
              მეტის ჩვენება
            </>
          )}
        </Button>
      );
    }
    return null;
  };

  const handleReplyClick = (e) => {
    e.stopPropagation();
    const allReplyInputs = document.querySelectorAll('.reply-input');
    allReplyInputs.forEach(input => {
      const container = input.closest('.comment-container');
      if (container && container !== e.target.closest('.comment-container')) {
        const replyButton = container.querySelector('.reply-button');
        if (replyButton) {
          const currentIsReplying = container.querySelector('.reply-input') !== null;
          if (currentIsReplying) {
            setIsReplying(false);
            setReplyText('');
          }
        }
      }
    });
    setIsReplying(!isReplying);
  };

  const handleDelete = async () => {
    try {
      const success = await onDelete(requestId, comment.id);
      if (!success) {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  return (
    <div 
      className={`comment-container mb-2 border-start ps-2 ${depth > 0 ? 'ms-2' : ''}`}
      style={{ borderColor: '#dee2e6' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div>
          <strong className="me-2">{comment.user?.name || 'Unknown'}</strong>
          <small className="text-muted">
            {moment(comment.created_at).format('MM/DD HH:mm')}
          </small>
        </div>
        <div className="d-flex gap-2">
          {canDelete && (
            <Button
              size="sm"
              color="link"
              className="p-0 text-danger me-2"
              onClick={toggleDeleteModal}
              style={{ textDecoration: 'none' }}
            >
              წაშლა
            </Button>
          )}
          <Button
            size="sm"
            color="link"
            className="p-0 reply-button"
            onClick={handleReplyClick}
          >
            პასუხი
          </Button>
        </div>
      </div>
      
      <p className="mb-1" style={{ fontSize: '0.95rem' }}>{comment.comment}</p>
      
      {isReplying && (
        <div className="mb-2 reply-input">
          <Input
            type="textarea"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            className="mb-1"
            onClick={e => e.stopPropagation()}
            onFocus={(e) => {
              e.stopPropagation();
              onMainInputFocus?.();
            }}
            rows={1}
            bsSize="sm"
          />
          <div className="d-flex gap-1">
            <Button 
              color="primary" 
              size="sm" 
              onClick={handleReply}
              disabled={!replyText.trim()}
            >
              გაგზავნა
            </Button>
            <Button 
              color="secondary" 
              size="sm" 
              onClick={e => { 
                e.stopPropagation(); 
                setIsReplying(false); 
                setReplyText(''); 
              }}
            >
              გაუქმება
            </Button>
          </div>
        </div>
      )}

      <div className="replies">
        {renderReplies()}
        {renderDeepRepliesControl()}
        {showDeepReplies && deepReplies.map(reply => (
          <Comment
            key={reply.id}
            comment={reply}
            requestId={requestId}
            onReply={onReply}
            onDelete={onDelete}
            onMainInputFocus={onMainInputFocus}
            currentUser={currentUser}
            depth={depth + 1}
          />
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
});

export default Comment; 