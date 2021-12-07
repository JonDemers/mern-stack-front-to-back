import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getPosts } from "../../actions/post";
import Spinner from "../layout/Spinner";
import PostForm from "./PostForm";
import PostItem from "./PostItem";

const Posts = ({
  auth: { isAuthenticated },
  post: { posts, loading },
  getPosts,
}) => {
  useEffect(() => {
    if (isAuthenticated) {
      getPosts();
    }
  }, [isAuthenticated, getPosts]);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="large text-primary">Posts</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Welcome to the community
          </p>
          <PostForm />
          <div className="posts">
            {posts.length > 0 ? (
              posts.map((post) => <PostItem key={post._id} post={post} />)
            ) : (
              <h4>No posts</h4>
            )}
          </div>
        </>
      )}
    </>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
