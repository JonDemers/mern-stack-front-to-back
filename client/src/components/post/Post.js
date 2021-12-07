import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getPost } from "../../actions/post";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Post = ({
  post: { post, loading },
  auth: { isAuthenticated },
  getPost,
}) => {
  const params = useParams();

  useEffect(() => {
    if (isAuthenticated) {
      getPost(params.id);
    }
  }, [isAuthenticated, getPost, params.id]);

  return (
    <>
      {post === null || loading ? (
        <Spinner />
      ) : (
        <>
          <Link to="/posts" className="btn">
            Back to posts
          </Link>
          <PostItem post={post} showActions={false} />
          <CommentForm />
          <div className="comments">
            {post.comments.map((comment) => (
              <CommentItem
                key={comment._id}
                postId={post._id}
                comment={comment}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

Post.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
