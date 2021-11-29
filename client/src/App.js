import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import store from "./store";
import { loadUser } from "./actions/auth";
import { useEffect } from "react";
import setAuthToken from "./utils/setAuthToken";

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
          </Routes>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
