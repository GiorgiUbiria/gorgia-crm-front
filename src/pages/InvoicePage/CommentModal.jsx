import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const styles = {
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      padding: '16px',
    },
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
  },
  closeButton: {
    color: '#9e9e9e',
    '&:hover': {
      color: '#1a237e',
    },
  },
  content: {
    padding: '24px 16px',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#1a237e',
      },
    },
  },
  actions: {
    padding: '16px',
    borderTop: '1px solid #e0e0e0',
  },
};

const CommentModal = ({
  open,
  onClose,
  comment,
  setComment,
  onSave
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      sx={styles.dialog}
    >
      <div style={styles.dialogTitle}>
        <Typography variant="h6">
          კომენტარის რედაქტირება
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={styles.closeButton}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </div>
      
      <DialogContent sx={styles.content}>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          multiline
          rows={6}
          label="კომენტარი"
          placeholder="შეიყვანეთ თქვენი კომენტარი აქ..."
          variant="outlined"
          sx={styles.textField}
        />
      </DialogContent>
      
      <DialogActions sx={styles.actions}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="inherit"
        >
          დახურვა
        </Button>
        <Button 
          onClick={onSave} 
          variant="contained"
          sx={{
            backgroundColor: '#1a237e',
            '&:hover': {
              backgroundColor: '#0d47a1',
            },
          }}
        >
          შენახვა
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal; 