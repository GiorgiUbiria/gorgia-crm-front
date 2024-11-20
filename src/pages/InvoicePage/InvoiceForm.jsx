import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const styles = {
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    },
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #f0f0f0',
  },
  dialogContent: {
    padding: '24px',
  },
  dialogActions: {
    padding: '16px 24px',
    borderTop: '1px solid #f0f0f0',
  },
  uploadButton: {
    border: '2px dashed #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    transition: 'all 0.2s ease',
    backgroundColor: '#fafafa',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      borderColor: '#bdbdbd',
    },
  },
  formControl: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e0e0e0',
    },
  },
  actionButton: {
    borderRadius: '8px',
    padding: '8px 24px',
    textTransform: 'none',
    fontWeight: 500,
  },
};

const InvoiceForm = ({
  open,
  onClose,
  onSave,
  invoice,
  isEdit,
  selectedFile,
  handleFileChange,
  status,
  setStatus,
  departments
}) => {
  const [selectedDepartment, setSelectedDepartment] = React.useState(
    invoice ? invoice.department : ''
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('department', event.target.department.value);
    if (selectedFile) {
      formData.append('invoice_file', selectedFile);
    }
    formData.append('status', status);
    formData.append('comments', event.target.comments.value);

    const data = {
      department: event.target.department.value,
      invoice_file: selectedFile,
      status: status,
      comments: event.target.comments.value
    };

    onSave(data);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      sx={styles.dialog}
    >
      <Box sx={styles.dialogTitle}>
        <Typography variant="h6">
          {isEdit ? 'ინვოისის რედაქტირება' : 'ინვოისის დამატება'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={styles.dialogContent}>
        <form id="invoiceForm" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required sx={styles.formControl}>
                <InputLabel id="department-label">დეპარტამენტი</InputLabel>
                <Select
                  labelId="department-label"
                  id="department"
                  name="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  label="დეპარტამენტი"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={styles.uploadButton}
                startIcon={<CloudUploadIcon />}
              >
                <Box>
                  <Typography variant="body1" component="div">
                    {selectedFile ? selectedFile.name : 'აირჩიეთ ფაილი'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    დასაშვებია PDF, DOC, DOCX, XLSX ფაილები
                  </Typography>
                </Box>
                <input
                  type="file"
                  name="invoice_file"
                  hidden
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  accept="application/pdf,.doc,.docx,.xlsx"
                  required={!isEdit}
                />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={styles.formControl}>
                <InputLabel>სტატუსი</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="სტატუსი"
                >
                  <MenuItem value="pending">ლოდინის რეჟიმში</MenuItem>
                  <MenuItem value="in_process">მიმდინარეობს</MenuItem>
                  <MenuItem value="completed">დასრულებულია</MenuItem>
                  <MenuItem value="rejected">უარყოფილია</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="comments"
                label="კომენტარი"
                multiline
                rows={4}
                fullWidth
                defaultValue={invoice ? invoice.comments : ''}
                sx={styles.formControl}
                placeholder="დაამატეთ კომენტარი..."
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <Box sx={styles.dialogActions}>
        <Button 
          onClick={onClose} 
          sx={{ ...styles.actionButton, mr: 1 }}
        >
          გაუქმება
        </Button>
        <Button 
          type="submit" 
          form="invoiceForm" 
          variant="contained" 
          sx={styles.actionButton}
        >
          {isEdit ? 'განახლება' : 'დამატება'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default InvoiceForm; 