import {
    FETCH_USER_START,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    CLEAR_USER,
  } from './actionTypes';
  
  export const fetchUserStart = () => ({
    type: FETCH_USER_START,
  });
  
  export const fetchUserSuccess = (data) => ({
    type: FETCH_USER_SUCCESS,
    payload: data,
  });
  
  export const fetchUserFailure = (error) => ({
    type: FETCH_USER_FAILURE,
    payload: error,
  });
  
  export const clearUser = () => ({
    type: CLEAR_USER,
  });
  