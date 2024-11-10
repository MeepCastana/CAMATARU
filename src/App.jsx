import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UsersList from "./UsersList";
import ContentTest from "./ContentTest";
import Login from "./Login"; // Import the Login component

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null); // State to hold logged-in user data

  return (
    <Router>
      <ContentTest />
      <Routes>
        {/* Route for the login page */}
        <Route
          path="/login"
          element={
            loggedInUser ? (
              <Navigate to="/users" /> // Redirect to /users if already logged in
            ) : (
              <Login onLogin={setLoggedInUser} /> // Show login if not authenticated
            )
          }
        />

        {/* Protected route for users list, only accessible when logged in */}
        <Route
          path="/users"
          element={
            loggedInUser ? (
              <UsersList user={loggedInUser} />
            ) : (
              <Navigate to="/login" /> // Redirect to login if not authenticated
            )
          }
        />

        {/* Default route redirects to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
