import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";
import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
} from "./types";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");
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
  console.info(`register is being called: ${email}`);
  return async (dispatch) => {
    console.info(`dispatch register is being called: ${email}`);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post("/api/users", body, config);
      console.info(`calling dispatch with REGISTER_SUCCESS: ${email}`);
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

      console.info(`calling dispatch with REGISTER_FAIL: ${email}`);
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};

export const login = (email, password) => {
  console.info(`login is being called: ${email}`);
  return async (dispatch) => {
    console.info(`dispatch login is being called: ${email}`);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post("/api/auth", body, config);
      console.info(`calling dispatch with LOGIN_SUCCESS: ${email}`);
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

      console.info(`calling dispatch with LOGIN_FAIL: ${email}`);
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };
};
