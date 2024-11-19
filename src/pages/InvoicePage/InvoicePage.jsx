import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../services/invoiceService';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null); // For editing a specific invoice
  const [isEdit, setIsEdit] = useState(false); // Determines if we're in edit mode
  const [modalOpen, setModalOpen] = useState(false); // Controls the invoice modal visibility
  const [commentModalOpen, setCommentModalOpen] = useState(false); // Controls the comment modal visibility
  const [selectedFile, setSelectedFile] = useState(null); // Stores the selected file
  const [selectedComment, setSelectedComment] = useState(''); // For storing and editing comments
  const [selectedInvoiceForComment, setSelectedInvoiceForComment] = useState(null); // Store the invoice for comment editing
  const [status, setStatus] = useState('pending'); // For editing status

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.data); // Assuming invoices are in response.data
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Toggle invoice modal visibility
  const toggleModal = () => setModalOpen(!modalOpen);

  // Toggle comment modal visibility
  const toggleCommentModal = () => setCommentModalOpen(!commentModalOpen);

  // Handle "Add Invoice" button click
  const handleAddClick = () => {
    setInvoice(null); // Clear the invoice to ensure fresh data for adding
    setSelectedFile(null); // Reset the file input
    setIsEdit(false); // Set to 'Add' mode
    setStatus('pending'); // Reset status
    toggleModal();
  };

  // Handle "Edit" button click
  const handleEditClick = (invoiceData) => {
    setInvoice(invoiceData);
    setSelectedFile(null); // Reset file when editing
    setStatus(invoiceData.status || 'pending'); // Set status for editing
    setIsEdit(true); // Set to 'Edit' mode
    toggleModal();
  };

  // Handle invoice deletion
  const handleDeleteClick = async (invoiceId) => {
    try {
      await deleteInvoice(invoiceId);
      fetchInvoices(); // Refresh the invoices list after deletion
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Store the selected file
  };

  // Handle form submission to save a new or updated invoice
  const handleSaveInvoice = async (event) => {
    event.preventDefault();

    const data = {
      department: event.target.department.value,
      invoice_file: selectedFile,
      status: status,
      comments: event.target.comments.value
    };
    
    try {
      if (isEdit) {
        await updateInvoice(invoice.id, data); // Use PUT or PATCH based on your API
      } else {
        await createInvoice(data); // POST request
      }
      fetchInvoices(); // Refresh invoices after creating/updating
      toggleModal(); // Close the modal
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  // Handle status change
  const handleStatusChange = (event, invoiceId) => {
    const newStatus = event.target.value;
    updateInvoice(invoiceId, { status: newStatus })
      .then(fetchInvoices) // Refresh invoices after status update
      .catch(error => console.error('Error updating status:', error));
  };

  // Open comment modal for editing
  const handleCommentClick = (invoiceData) => {
    setSelectedComment(invoiceData.comments || ''); // Set the current comment
    setSelectedInvoiceForComment(invoiceData); // Set the selected invoice for comment editing
    toggleCommentModal();
  };

  // Handle comment save
  const handleSaveComment = async () => {
    if (selectedInvoiceForComment) {
      try {
        // Update the invoice with the new comment
        const updatedInvoice = await updateInvoice(selectedInvoiceForComment.id, { comments: selectedComment });
        
        // Update the local invoices state with the updated comment
        setInvoices(prevInvoices =>
          prevInvoices.map(invoice =>
            invoice.id === updatedInvoice.id ? updatedInvoice : invoice
          )
        );

        // Close the modal after success
        toggleCommentModal();
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    }
  };

  // Table columns definition
  const columns = useMemo(
    () => [
      { field: 'id', headerName: '#', width: 50 },
      { field: 'department', headerName: 'Department', flex: 1 },
      {
        field: 'invoice_file',
        headerName: 'Invoice File',
        flex: 1,
        renderCell: (params) => (
          <a href={`http://your-backend-url.com/storage/${params.value}`} download style={{ color: '#2196F3' }}>
            Download
          </a>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: (params) => (
          <Select
            value={params.row.status}
            onChange={(event) => handleStatusChange(event, params.row.id)}
            sx={{ width: '100%' }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_process">In Process</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        ),
      },
      {
        field: 'comments',
        headerName: 'Comments',
        flex: 1,
        renderCell: (params) => (
          <Button
            variant="text"
            style={{ color: '#4caf50', textDecoration: 'underline' }}
            onClick={() => handleCommentClick(params.row)}
          >
            {params.row.comments || 'Add Comment'}
          </Button>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon /> {/* Edit Icon */}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <DeleteIcon /> {/* Delete Icon */}
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Container maxWidth={false} style={{ width: '100%', paddingBottom: '40px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Invoice Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        style={{
          marginBottom: '20px',
          padding: '10px 30px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto', // Center the button horizontally
        }}
      >
        ADD INVOICE
      </Button>
      <div style={{ height: 400, width: '100%', marginBottom: '40px' }}>
        <DataGrid
          rows={invoices}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '10px',
              borderBottom: '2px solid #ccc',
            },
            '& .MuiDataGrid-cell': {
              padding: '10px',
              fontSize: '14px',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: '#f1f1f1',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              paddingTop: '10px',
            },
          }}
        />
      </div>

      {/* Modal for Adding/Editing Invoice */}
      <Dialog open={modalOpen} onClose={toggleModal} fullWidth>
        <DialogTitle>{isEdit ? 'Edit Invoice' : 'Add Invoice'}</DialogTitle>
        <DialogContent>
          <form id="invoiceForm" onSubmit={handleSaveInvoice}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="department"
                  label="Department"
                  fullWidth
                  required
                  defaultValue={invoice ? invoice.department : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  style={{ textAlign: 'left', padding: '10px' }}
                >
                  {selectedFile ? selectedFile.name : 'Invoice File *'}
                  <input
                    type="file"
                    name="invoice_file"
                    hidden
                    onChange={handleFileChange}
                    accept="application/pdf,.doc,.docx,.xlsx"
                    required={!isEdit}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Select
                  label="Status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  fullWidth
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_process">In Process</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="comments"
                  label="Comments (optional)"
                  multiline
                  rows={4}
                  fullWidth
                  defaultValue={invoice ? invoice.comments : ''}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal} color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="invoiceForm" color="primary">
            {isEdit ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Comment Editing */}
      <Dialog open={commentModalOpen} onClose={toggleCommentModal} fullWidth>
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            value={selectedComment}
            onChange={(e) => setSelectedComment(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleCommentModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveComment} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InvoicePage;
