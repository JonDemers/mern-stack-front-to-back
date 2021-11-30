import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes } from "react-router";

const PrivateRoute = ({
  auth: { loading, isAuthenticated },
  element,
  ...rest
}) => {
  return (
    <Routes>
      <Route
        {...rest}
        element={
          !loading && !isAuthenticated ? <Navigate to="/login" /> : element
        }
      />
    </Routes>
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
