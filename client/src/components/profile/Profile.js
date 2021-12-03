import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const Profile = ({ profile: { profile, loading }, auth, getProfileById }) => {
  const params = useParams();

  useEffect(() => {
    getProfileById(params.id);
  }, [getProfileById]);
  return (
    <>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <>
          <Link to="/profiles" className="btn btn-light">
            Back to profiles
          </Link>
          {auth?.isAuthenticated &&
            !auth?.loading &&
            auth?.user._id === profile?.user?._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit profile
              </Link>
            )}
        </>
      )}
    </>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
