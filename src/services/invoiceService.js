import defaultInstance from '../plugins/axios';

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

export const createInvoice = async (data) => {
  try {
    const formData = new FormData();
    formData.append('department', data.department);
    formData.append('invoice_file', data.invoice_file);
    formData.append('status', data.status);
    formData.append('comments', data.comments || '');

    console.log(data);

    const response = await defaultInstance.post('/api/invoices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateInvoice = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('department', data.department);
    if (data.invoice_file) formData.append('invoice_file', data.invoice_file);
    formData.append('status', data.status);
    formData.append('comments', data.comments || '');

    const response = await defaultInstance.put(`/api/invoices/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating invoice:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await defaultInstance.delete(`/api/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};
