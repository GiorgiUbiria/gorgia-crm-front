// src/services/contactActions.js
import api from '../plugins/axios';

// Action Types
export const FETCH_CONTACTS_REQUEST = 'FETCH_CONTACTS_REQUEST';
export const FETCH_CONTACTS_SUCCESS = 'FETCH_CONTACTS_SUCCESS';
export const FETCH_CONTACTS_FAIL = 'FETCH_CONTACTS_FAIL';

export const ADD_CONTACT_REQUEST = 'ADD_CONTACT_REQUEST';
export const ADD_CONTACT_SUCCESS = 'ADD_CONTACT_SUCCESS';
export const ADD_CONTACT_FAIL = 'ADD_CONTACT_FAIL';

export const UPDATE_CONTACT_REQUEST = 'UPDATE_CONTACT_REQUEST';
export const UPDATE_CONTACT_SUCCESS = 'UPDATE_CONTACT_SUCCESS';
export const UPDATE_CONTACT_FAIL = 'UPDATE_CONTACT_FAIL';

export const DELETE_CONTACT_REQUEST = 'DELETE_CONTACT_REQUEST';
export const DELETE_CONTACT_SUCCESS = 'DELETE_CONTACT_SUCCESS';
export const DELETE_CONTACT_FAIL = 'DELETE_CONTACT_FAIL';

// Fetch all contacts
export const fetchContacts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CONTACTS_REQUEST });

    const response = await api.get('/contacts');
    dispatch({
      type: FETCH_CONTACTS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CONTACTS_FAIL,
      payload: error.message,
    });
  }
};

// Add new contact
export const addContact = (contactData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_CONTACT_REQUEST });

    const response = await api.post('/contacts', contactData);
    dispatch({
      type: ADD_CONTACT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: ADD_CONTACT_FAIL,
      payload: error.message,
    });
  }
};

// Update contact by ID
export const updateContact = (id, contactData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CONTACT_REQUEST });

    const response = await api.put(`/contacts/${id}`, contactData);
    dispatch({
      type: UPDATE_CONTACT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CONTACT_FAIL,
      payload: error.message,
    });
  }
};

// Delete contact by ID
export const deleteContact = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CONTACT_REQUEST });

    await api.delete(`/contacts/${id}`);
    dispatch({
      type: DELETE_CONTACT_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CONTACT_FAIL,
      payload: error.message,
    });
  }
};
