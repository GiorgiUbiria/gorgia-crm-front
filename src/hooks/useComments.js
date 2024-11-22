import { useState } from 'react';
import { fetchCommentsForLeadRequest, addCommentToLeadRequest, deleteCommentFromLeadRequest } from '../services/leadRequestCommentsService';

export const useComments = () => {
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [error, setError] = useState(null);

  const fetchComments = async (requestId) => {
    setIsLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      const response = await fetchCommentsForLeadRequest(requestId);
      setComments(prev => ({ 
        ...prev, 
        [requestId]: Array.isArray(response) ? response : (response.data || [])
      }));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const addComment = async (requestId, commentText, parentId = null) => {
    if (!commentText?.trim()) return;
    
    try {
      await addCommentToLeadRequest(requestId, commentText, parentId);
      await fetchComments(requestId);
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  };

  const deleteComment = async (requestId, commentId) => {
    setIsLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      await deleteCommentFromLeadRequest(commentId);
      await fetchComments(requestId);
      return true;
    } catch (err) {
      setError(err);
      console.error('Error deleting comment:', err);
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment
  };
}; 