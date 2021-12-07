import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import { addComment } from "../../actions/post";

const CommentForm = ({ addComment }) => {
  const params = useParams();
  const [formData, setFormData] = useState({
    text: "",
  });

  const { text } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    addComment(params.id, formData);
    setFormData({ text: "" });
  };

  return (
    <>
      <div className="post-form">
        <div className="bg-primary p">
          <h3>Leave a comment</h3>
        </div>
        <form className="form my-1" onSubmit={(e) => onSubmit(e)}>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Your comment"
            required
            value={text}
            onChange={(e) => onChange(e)}
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
    </>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
