import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import ProfileAbout from "./ProfileAbout";
import ProfileEducation from "./ProfileEducation";
import ProfileExperience from "./ProfileExperience";
import ProfileGithub from "./ProfileGithub";
import ProfileTop from "./ProfileTop";

const Profile = ({ auth }) => {
  const params = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/profile/user/${params.id}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error(err.message);
        console.error(err.stack);
      }
    };
    fetchProfile();
  }, [params.id]);
  return (
    <>
      {profile === null ? (
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

          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                profile.experience.map((exp) => (
                  <ProfileExperience key={exp._id} experience={exp} />
                ))
              ) : (
                <h4>No experience</h4>
              )}
            </div>

            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                profile.education.map((edu) => (
                  <ProfileEducation key={edu._id} education={edu} />
                ))
              ) : (
                <h4>No education</h4>
              )}
            </div>

            {profile.githubUsername && (
              <ProfileGithub username={profile.githubUsername} />
            )}
          </div>
        </>
      )}
    </>
  );
};

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Profile);
