import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./Login";
import Header from "./Header";
import UsersList from "./UsersList";
import HomePage from "./HomePage"; // Create a new HomePage component
import DragAndDrop from "./DragAndDrop";

const App = () => {
  const [loggedInPin, setLoggedInPin] = useState(
    localStorage.getItem("userPin") || null
  );
  const [loggedInUserName, setLoggedInUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [loggedInUserAvatar, setLoggedInUserAvatar] = useState(
    localStorage.getItem("userAvatar") || ""
  );
  const [clickedUsers, setClickedUsers] = useState({});

  const handleLogin = (pin, name, avatar) => {
    setLoggedInPin(pin);
    setLoggedInUserName(name);
    setLoggedInUserAvatar(avatar);

    // Save session data
    localStorage.setItem("userPin", pin);
    localStorage.setItem("userName", name);
    localStorage.setItem("userAvatar", avatar);
  };

  const handleLogout = async () => {
    const userId = Object.keys(clickedUsers).find(
      (id) => clickedUsers[id] && loggedInPin
    );

    if (userId) {
      try {
        await fetch("/api/toggle-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Adding a custom header
          },
          body: JSON.stringify({ userId, status: false }),
        });
        setClickedUsers((prev) => ({
          ...prev,
          [userId]: false,
        }));
      } catch (error) {
        console.error("Failed to untoggle user status on logout:", error);
      }
    }

    // Clear session data
    localStorage.removeItem("userPin");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");

    // Reset state
    setLoggedInPin(null);
    setLoggedInUserName("");
    setLoggedInUserAvatar("");
    setClickedUsers({});
  };

  return (
    <Router>
      <div>
        {loggedInPin && (
          <Header
            userName={loggedInUserName}
            userAvatar={loggedInUserAvatar}
            onLogout={handleLogout}
          />
        )}
        <Routes>
          {/* Login Route */}
          <Route
            path="/"
            element={
              loggedInPin ? (
                <Navigate to="/home" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Home Route */}
          <Route
            path="/home"
            element={loggedInPin ? <HomePage /> : <Navigate to="/" />}
          />

          <Route path="/test" element={<DragAndDrop />} />
          {/* Users Route */}
          <Route
            path="/users"
            element={
              loggedInPin ? (
                <UsersList
                  loggedInPin={loggedInPin}
                  clickedUsers={clickedUsers}
                  setClickedUsers={setClickedUsers}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
