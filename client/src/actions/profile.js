import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "./types";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const createProfile =
  (
    {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubUsername,
      youtube,
      twitter,
      facebook,
      linkedIn,
      instagram,
    },
    navigate,
    edit = false
  ) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubUsername,
      youtube,
      twitter,
      facebook,
      linkedIn,
      instagram,
    });
    try {
      const res = await axios.post("/api/profile", body, config);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      dispatch(
        setAlert(edit ? "Profile updated" : "Profile created", "success")
      );
      if (!edit) {
        navigate("/dashboard");
      }
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error?.msg, "danger")));
      } else {
        console.error(err.message);
        console.error(err.stack);
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

export const addExperience = (formData, navigate) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put("/api/profile/experience", formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Experience added", "success"));
    navigate("/dashboard");
  } catch (err) {
    const errors = err?.response?.data?.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error?.msg, "danger")));
    } else {
      console.error(err.message);
      console.error(err.stack);
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addEducation = (formData, navigate) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put("/api/profile/education", formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Education added", "success"));
    navigate("/dashboard");
  } catch (err) {
    const errors = err?.response?.data?.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error?.msg, "danger")));
    } else {
      console.error(err.message);
      console.error(err.stack);
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
