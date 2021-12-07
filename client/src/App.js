import { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { loadUser } from "./actions/auth";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Alert from "./components/layout/Alert";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Post from "./components/post/Post";
import Posts from "./components/posts/Posts";
import AddEducation from "./components/profile-form/AddEducation";
import AddExperience from "./components/profile-form/AddExperience";
import CreateProfile from "./components/profile-form/CreateProfile";
import EditProfile from "./components/profile-form/EditProfile";
import Profile from "./components/profile/Profile";
import Profiles from "./components/profiles/Profiles";
import PrivateRoute from "./components/routing/PrivateRoute";
import store from "./store";

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
        </Routes>
        <section className="container">
          <Alert />
          <Routes>
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/profiles" element={<Profiles />} />
            <Route exact path="/profile/:id" element={<Profile />} />
          </Routes>
          <PrivateRoute exact path="/dashboard" element={<Dashboard />} />
          <PrivateRoute
            exact
            path="/create-profile"
            element={<CreateProfile />}
          />
          <PrivateRoute exact path="/edit-profile" element={<EditProfile />} />
          <PrivateRoute
            exact
            path="/add-experience"
            element={<AddExperience />}
          />
          <PrivateRoute
            exact
            path="/add-education"
            element={<AddEducation />}
          />
          <PrivateRoute exact path="/posts" element={<Posts />} />
          <PrivateRoute exact path="/posts/:id" element={<Post />} />
        </section>
      </Router>
    </Provider>
  );
};

export default App;
