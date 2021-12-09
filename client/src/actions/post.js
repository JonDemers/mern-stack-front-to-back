import axios from "axios";
import { setAlert } from "./alert";
import {
  ADD_COMMENT,
  ADD_POST,
  DELETE_POST,
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  REMOVE_COMMENT,
  UPDATE_LIKES,
} from "./types";

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/posts`
    );
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/posts/like/${postId}`
    );
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/posts/unlike/${postId}`
    );
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}`
    );
    dispatch({
      type: DELETE_POST,
      payload: postId,
    });
    dispatch(setAlert("Post removed", "success"));
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/posts`,
      formData,
      config
    );
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert("Post created", "success"));
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/posts/${id}`
    );
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/posts/comment/${postId}`,
      formData,
      config
    );
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert("Comment added", "success"));
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/api/posts/comment/${postId}/${commentId}`
    );
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });
    dispatch(setAlert("Comment removed", "success"));
  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
