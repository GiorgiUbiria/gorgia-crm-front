// reducers/userReducer.js
import {
    FETCH_USER_START,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    CLEAR_USER,
  } from "./actionTypes";
  
  const initialState = {
    data: null,
    loading: false,
    error: null,
  };
  
  const user = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_USER_START:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      case FETCH_USER_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case CLEAR_USER:
        return {
          ...state,
          data: null,
          loading: false,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export default user;
  