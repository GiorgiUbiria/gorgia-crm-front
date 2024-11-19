
import defaultInstance from 'plugins/axios';
import { FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE } from './actionTypes';

export const fetchUsers = () => async (dispatch) => {
    console.log("fetchUsers function called")
  dispatch({ type: FETCH_USERS_REQUEST });
  console.log("Fetching users...");
  try {
    const response = await defaultInstance.get('/api/admin/users'); 

    console.log("users", response);
    
    dispatch({ type: FETCH_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_FAILURE,
      payload: error.response ? error.response.data : 'Something went wrong',
    });
  }
};
