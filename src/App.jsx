import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Header from "./Header";
import UsersList from "./UsersList";
import HomePage from "./HomePage";
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
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin status
  const [clickedUsers, setClickedUsers] = useState({});

  useEffect(() => {
    // Fetch admin status if logged in
    const fetchAdminStatus = async () => {
      if (loggedInPin) {
        try {
          const response = await fetch(`/api/get-user-by-pin/${loggedInPin}`);
          const data = await response.json();

          setIsAdmin(data?.is_admin || false); // Update admin status
        } catch (error) {
          console.error("Failed to fetch admin status:", error);
        }
      }
    };

    fetchAdminStatus();
  }, [loggedInPin]);

  const handleLogin = (pin, name, avatar) => {
    setLoggedInPin(pin);
    setLoggedInUserName(name);
    setLoggedInUserAvatar(avatar);

    // Save session data
    localStorage.setItem("userPin", pin);
    localStorage.setItem("userName", name);
    localStorage.setItem("userAvatar", avatar);

    // Fetch admin status after login
    setTimeout(() => {
      fetchAdminStatus();
    }, 0);
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
    setIsAdmin(false);
    setClickedUsers({});
  };

  return (
    <Router>
      <div className="w-screen">
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

          {/* Drag and Drop Route */}
          <Route path="/test" element={<DragAndDrop isAdmin={isAdmin} />} />

          {/* Users Route */}
          <Route
            path="/users"
            element={
              loggedInPin ? (
                <UsersList
                  loggedInPin={loggedInPin}
                  clickedUsers={clickedUsers}
                  setClickedUsers={setClickedUsers}
                  isAdmin={isAdmin} // Pass admin status here
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
console.log("Admin Status:", isAdmin);

export default App;
