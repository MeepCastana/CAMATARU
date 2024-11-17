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
  const [users, setUsers] = useState([]); // Centralized users state
  const [clickedUsers, setClickedUsers] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to fetch users and update state
  const fetchUsers = async () => {
    try {
      const response = await fetch("https://camataru.ro/api/users", {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });
      const data = await response.json();

      // Initialize statuses and check if the logged-in user is an admin
      const initialStatus = {};
      let adminStatus = false;

      data.forEach((user) => {
        initialStatus[user.discord_id] = user.status || false;
        if (user.pin === loggedInPin && user.is_admin) {
          adminStatus = true;
        }
      });

      setUsers(data); // Update users globally
      setClickedUsers(initialStatus); // Sync clickedUsers with DB data
      setIsAdmin(adminStatus); // Set admin status
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Fetch users on initial load and when loggedInPin changes
  useEffect(() => {
    if (loggedInPin) fetchUsers();
  }, [loggedInPin]);

  // Handle user login
  const handleLogin = (pin, name, avatar) => {
    setLoggedInPin(pin);
    setLoggedInUserName(name);
    setLoggedInUserAvatar(avatar);

    localStorage.setItem("userPin", pin);
    localStorage.setItem("userName", name);
    localStorage.setItem("userAvatar", avatar);
  };

  // Handle user logout
  const handleLogout = async () => {
    const userId = Object.keys(clickedUsers).find(
      (id) => clickedUsers[id] && loggedInPin
    );

    if (userId) {
      try {
        await fetch("https://camataru.ro/api/toggle-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, status: false }),
        });
      } catch (error) {
        console.error("Failed to untoggle user status on logout:", error);
      }
    }

    localStorage.removeItem("userPin");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");

    setLoggedInPin(null);
    setLoggedInUserName("");
    setLoggedInUserAvatar("");
    setClickedUsers({});
    setIsAdmin(false);

    setUsers([]); // Clear users state on logout
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="bg-zinc-800">
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
                <Navigate to="/home" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/home"
            element={loggedInPin ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/taxa"
            element={
              loggedInPin ? (
                <DragAndDrop
                  loggedInPin={loggedInPin}
                  users={users}
                  setUsers={fetchUsers} // Fetch users after any update
                  clickedUsers={clickedUsers}
                  setClickedUsers={setClickedUsers}
                  isAdmin={isAdmin}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/membrii"
            element={
              loggedInPin ? (
                <UsersList
                  loggedInPin={loggedInPin}
                  users={users}
                  setUsers={fetchUsers} // Fetch users after any update
                  clickedUsers={clickedUsers}
                  setClickedUsers={setClickedUsers}
                  isAdmin={isAdmin}
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
