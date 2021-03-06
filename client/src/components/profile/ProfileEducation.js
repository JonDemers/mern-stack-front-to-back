import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileEducation = ({
  education: { school, degree, fieldOfStudy, from, to, current, description },
}) => {
  return (
    <>
      <div>
        <h3 className="text-dark">{school}</h3>
        <p>
          <Moment format="YYYY-MM">{from}</Moment> -{" "}
          {!to ? "Present" : <Moment format="YYYY-MM">{to}</Moment>}
        </p>
        <p>
          <strong>Degree: </strong>
          {degree}
        </p>
        <p>
          <strong>Field Of Study: </strong>
          {fieldOfStudy}
        </p>
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      </div>
    </>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
