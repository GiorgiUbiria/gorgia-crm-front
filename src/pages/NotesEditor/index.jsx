import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, IconButton, Button, CircularProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createNote, updateNote, getNote } from '../../services/note';

const NotesEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    isDirty: false,
  });
  const [loadingState, setLoadingState] = useState({
    isFetching: false,
    isSaving: false,
  });
  const [error, setError] = useState('');

  const fetchNote = useCallback(async (noteId) => {
    setLoadingState(prev => ({ ...prev, isFetching: true }));
    try {
      const response = await getNote(noteId);
      const { title, content } = response.data;
      setFormState({
        title: title || '',
        content: content || '',
        isDirty: false,
      });
    } catch (err) {
      setError('Failed to load note data.');
    } finally {
      setLoadingState(prev => ({ ...prev, isFetching: false }));
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchNote(id);
    }
  }, [id, fetchNote]);

  const validateForm = () => {
    const errors = [];
    if (!formState.title.trim()) {
      errors.push('Title is required');
    }
    if (formState.title.length > 255) {
      errors.push('Title must not exceed 255 characters');
    }
    if (!formState.content.trim()) {
      errors.push('Content is required');
    }
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoadingState(prev => ({ ...prev, isSaving: true }));
    setError('');
    
    try {
      const data = {
        title: formState.title.trim(),
        content: formState.content.trim()
      };

      if (id) {
        await updateNote(id, data);
      } else {
        await createNote(data);
      }
      
      setFormState(prev => ({ ...prev, isDirty: false }));
      navigate('/notes');
    } catch (err) {
      const serverErrors = err.response?.data;
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors)
          .flat()
          .filter(Boolean)
          .join(', ');
        setError(errorMessages || 'Failed to save note');
      } else {
        setError('Failed to save note. Please try again.');
      }
    } finally {
      setLoadingState(prev => ({ ...prev, isSaving: false }));
    }
  };

  const handleChange = (field) => (value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      isDirty: true
    }));
    setError('');
  };

  const isFormValid = () => {
    return formState.title.trim().length > 0 && 
           formState.title.length <= 255 &&
           formState.content.trim().length > 0;
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="notes-editor-container">
          <Box
            sx={{
              width: '100%',
              padding: '30px',
              backgroundColor: '#ffffff',
              borderRadius: '15px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              {/* Back Button */}
              <IconButton onClick={() => navigate('/notes')} sx={{ color: '#007dba' }}>
                <ArrowBackIcon />
              </IconButton>

              {/* Save Button with Loading Indicator */}
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loadingState.isSaving || !isFormValid()}
                sx={{
                  backgroundColor: '#007dba',
                  color: '#ffffff',
                  borderRadius: '25px',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {loadingState.isSaving ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                {loadingState.isSaving ? 'Saving...' : 'Save'}
              </Button>
            </Box>

            {/* Title Input */}
            <TextField
              variant="standard"
              placeholder="Note Title..."
              fullWidth
              value={formState.title}
              onChange={(e) => handleChange('title')(e.target.value)}
              error={!formState.title.trim() && formState.isDirty}
              helperText={!formState.title.trim() && formState.isDirty ? 'Title is required' : ''}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '24px', fontWeight: 'bold', color: '#007dba' },
              }}
              sx={{ mb: 3 }}
            />

            {loadingState.isFetching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ReactQuill
                value={formState.content}
                onChange={handleChange('content')}
                placeholder="Type your note here..."
                theme="snow"
                style={{
                  height: '300px',
                  marginBottom: '50px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '10px',
                  padding: '10px',
                }}
              />
            )}

            {/* Error Message */}
            {error && (
              <Box sx={{ marginTop: '20px', padding: '10px', borderRadius: '5px', backgroundColor: '#ffefef' }}>
                <Typography sx={{ color: '#d9534f' }}>{error}</Typography>
              </Box>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default NotesEditor;
