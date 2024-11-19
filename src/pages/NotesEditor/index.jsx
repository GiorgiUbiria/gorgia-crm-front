import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, IconButton, Breadcrumbs, Button, CircularProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createNote, updateNote, getNote } from '../../services/note';
import deleteNoteIcon from '../../assets/images/delete-note.png';

const NotesEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);


  
  

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchNote = async () => {
        try {
          const response = await getNote(id);

          console.log(response);
          
          setTitle(response.data.title)
          setContent(response.data.content);
        } catch (error) {
          setError('Failed to load note data.');
        }
      };
      fetchNote();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const data = { title, content };
      if (isEdit) {
        await updateNote(id, data);
      } else {
        await createNote(data);
      }
      navigate('/notes');
    } catch (error) {
      setError('Failed to save note. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  console.log(content);
  

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="Notes Editor" />
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
                disabled={loading}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>

            {/* Title Input */}
            <TextField
              variant="standard"
              placeholder="Note Title..."
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '24px', fontWeight: 'bold', color: '#007dba' },
              }}
              sx={{ mb: 3 }}
            />

            {/* Rich Text Editor */}
            <ReactQuill
              value={content}
              onChange={setContent}
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
