import defaultInstance from 'plugins/axios';
import { FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE } from './actionTypes';

export const fetchUser = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_REQUEST });
  try {
    const response = await defaultInstance.get('/api/user');
    dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      payload: error.response ? error.response.data : 'Something went wrong',
    });
  }
};
