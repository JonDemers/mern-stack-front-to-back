import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";
import {
  AUTH_ERROR,
  CLEAR_PROFILE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
} from "./types";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth`
    );
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const register = ({ name, email, password }) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users`,
        body,
        config
      );
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error?.msg, "danger")));
      } else {
        console.error(err.message);
        console.error(err.stack);
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth`,
        body,
        config
      );
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error?.msg, "danger")));
      } else {
        console.error(err.message);
        console.error(err.stack);
      }

      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };
};

export const logout = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
