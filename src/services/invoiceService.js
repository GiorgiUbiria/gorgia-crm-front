import defaultInstance from '../plugins/axios';

// Fetch all invoices
export const getInvoices = async (page = 1, limit = 10) => {
  try {
    const response = await defaultInstance.get('/api/invoices', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (data) => {
  try {
    // Create FormData object to send multipart/form-data
    const formData = new FormData();
    formData.append('department', data.department);
    formData.append('invoice_file', data.invoice_file); // Assuming `data.invoice_file` is a File object
    formData.append('status', data.status);
    formData.append('comments', data.comments || '');
  
    console.log(data);
  
    // Make a POST request to the server with formData
    const response = await defaultInstance.post('/api/invoices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  
    // Return the server response
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update an invoice using PUT (for full update)
export const updateInvoice = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('department', data.department);
    if (data.invoice_file) formData.append('invoice_file', data.invoice_file); // Only append if the file exists
    formData.append('status', data.status);
    formData.append('comments', data.comments || '');

    // Using PUT for a full update (Laravel expects PUT or PATCH for updates)
    const response = await defaultInstance.put(`/api/invoices/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating invoice:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (id) => {
  try {
    const response = await defaultInstance.delete(`/api/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};
