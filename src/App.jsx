import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import UsersList from "./UsersList";
import Header from "./Header";

const App = () => {
  const [loggedInPin, setLoggedInPin] = useState(
    localStorage.getItem("userPin")
  );

  // Define username and avatar for the logged-in user (these could be fetched from the backend on login)
  const [loggedInUserName, setLoggedInUserName] = useState("Username"); // Example name
  const [loggedInUserAvatar, setLoggedInUserAvatar] = useState(
    "https://example.com/path-to-avatar.jpg"
  ); // Example avatar URL

  const handleLogout = () => {
    localStorage.removeItem("userPin");
    setLoggedInPin(null);
    setLoggedInUserName("");
    setLoggedInUserAvatar("");
  };

  return (
    <Router>
      <div className="app-container">
        {loggedInPin && (
          <Header
            userName={loggedInUserName}
            userAvatar={loggedInUserAvatar}
            onLogout={handleLogout}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              loggedInPin ? (
                <UsersList
                  loggedInPin={loggedInPin}
                  loggedInUserName={loggedInUserName}
                  loggedInUserAvatar={loggedInUserAvatar}
                />
              ) : (
                <Login onLogin={setLoggedInPin} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
