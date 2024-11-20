import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../services/invoiceService';
import InvoiceForm from './InvoiceForm';
import CommentModal from './CommentModal';
import DownloadIcon from '@mui/icons-material/Download';
import CommentIcon from '@mui/icons-material/Comment';
import AddIcon from '@mui/icons-material/Add';
import { getDepartments } from '../../services/admin/department';

const styles = {
  pageContainer: {
    width: '100%',
    padding: '24px',
    backgroundColor: '#f7f9fc',
  },
  header: {
    marginBottom: '24px',
    color: '#1a237e',
  },
  addButton: {
    marginBottom: '24px',
    padding: '12px 24px',
    backgroundColor: '#1a237e',
    '&:hover': {
      backgroundColor: '#0d47a1',
    },
  },
  tableContainer: {
    height: 600,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  actionButton: {
    minWidth: '40px',
    padding: '8px',
  },
  downloadLink: {
    color: '#1a237e',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  statusSelect: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    '&:hover': {
      borderColor: '#1a237e',
    },
  },
};

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
  const [departments, setDepartments] = useState([]);

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        setDepartments(response.data.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
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
  const handleFileChange = (file) => {
    setSelectedFile(file); // Store the selected file
  };

  // Handle form submission to save a new or updated invoice
  const handleSaveInvoice = async (data) => {
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
  const handleStatusChange = async (newStatus, invoiceId) => {
    try {
      await updateInvoice(invoiceId, { status: newStatus });
      fetchInvoices(); // Refresh invoices after status update
    } catch (error) {
      console.error('Error updating status:', error);
    }
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
          prevInvoices.map(inv =>
            inv.id === updatedInvoice.id ? updatedInvoice : inv
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
      { field: 'id', headerName: '#', width: 70 },
      { 
        field: 'department', 
        headerName: 'დეპარტამენტი', 
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'invoice_file',
        headerName: 'ინვოისის ფაილი',
        flex: 1,
        minWidth: 130,
        renderCell: (params) => (
          <Button
            variant="text"
            href={`http://back.gorgia.ge/storage/${params.value}`}
            download
            sx={styles.downloadLink}
            startIcon={<DownloadIcon />}
          >
            ჩამოტვირთვა
          </Button>
        ),
      },
      {
        field: 'status',
        headerName: 'სტატუსი',
        width: 180,
        renderCell: (params) => (
          <select
            value={params.row.status}
            onChange={(e) => handleStatusChange(e.target.value, params.row.id)}
            style={styles.statusSelect}
          >
            <option value="pending">🕒 ლოდინის რეჟიმში</option>
            <option value="in_process">⚙️ მიმდინარეობს</option>
            <option value="completed">✅ დასრულებულია</option>
            <option value="rejected">❌ უარყოფილია</option>
          </select>
        ),
      },
      {
        field: 'comments',
        headerName: 'კომენტარი',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Button
            variant="text"
            onClick={() => handleCommentClick(params.row)}
            startIcon={<CommentIcon />}
            sx={{
              color: params.row.comments ? '#1a237e' : '#66bb6a',
              textTransform: 'none',
            }}
          >
            {params.row.comments ? 'კომენტარის რედაქტირება' : 'კომენტარის დამატება'}
          </Button>
        ),
      },
      {
        field: 'actions',
        headerName: 'მოქმედებები',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
            justifyContent="center"
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            <IconButton
              color="primary"
              onClick={() => handleEditClick(params.row)}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row.id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [handleStatusChange, handleDeleteClick, handleEditClick, handleCommentClick]
  );

  return (
    <Container maxWidth={false} sx={styles.pageContainer}>
      <Typography variant="h4" component="h1" sx={styles.header}>
        Invoice Management
      </Typography>
      <Button
        variant="contained"
        onClick={handleAddClick}
        sx={styles.addButton}
        startIcon={<AddIcon />}
      >
        დაამატე ინვოისი
      </Button>
      <Paper sx={styles.tableContainer}>
        <DataGrid
          rows={invoices}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          localeText={{
            MuiTablePagination: {
              labelRowsPerPage: 'სტრიქონები გვერდზე:',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to} ${count}-დან`,
            }
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontSize: '14px',
              fontWeight: 600,
              borderBottom: '2px solid #e0e0e0',
            },
            '& .MuiDataGrid-cell': {
              fontSize: '14px',
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: '#f8f9ff',
              },
            },
            '& .MuiCheckbox-root': {
              color: '#1a237e',
            },
            // Add pagination styling
            '& .MuiTablePagination-root': {
              alignItems: 'center',
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              margin: 0,
            },
            '& .MuiTablePagination-toolbar': {
              minHeight: '48px',
            }
          }}
        />
      </Paper>

      {/* Invoice Form Modal */}
      <InvoiceForm
        open={modalOpen}
        onClose={toggleModal}
        onSave={handleSaveInvoice}
        invoice={invoice}
        isEdit={isEdit}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        status={status}
        setStatus={setStatus}
        departments={departments}
      />

      {/* Comment Editing Modal */}
      <CommentModal
        open={commentModalOpen}
        onClose={toggleCommentModal}
        comment={selectedComment}
        setComment={setSelectedComment}
        onSave={handleSaveComment}
      />
    </Container>
  );
};

export default InvoicePage;
