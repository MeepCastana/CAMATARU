import React, { useState } from "react";
import Login from "./Login";
import Header from "./Header";
import UsersList from "./UsersList";
import io from "socket.io-client";

const socket = io(); // Initialize Socket.IO connection

const App = () => {
  const [loggedInPin, setLoggedInPin] = useState(
    localStorage.getItem("userPin")
  );
  const [loggedInUserName, setLoggedInUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [loggedInUserAvatar, setLoggedInUserAvatar] = useState(
    localStorage.getItem("userAvatar") || ""
  );
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const handleLogin = (pin, name, avatar, userId) => {
    setLoggedInPin(pin);
    setLoggedInUserName(name);
    setLoggedInUserAvatar(avatar);
    setLoggedInUserId(userId);
  };

  const handleLogout = async () => {
    if (loggedInUserId) {
      try {
        // Update the backend to untoggle the user's status
        await fetch("/api/toggle-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedInUserId, status: false }),
        });

        // Emit the status update to all clients through Socket.IO
        socket.emit("status-updated", {
          userId: loggedInUserId,
          status: false,
        });
      } catch (error) {
        console.error("Failed to untoggle user status on logout:", error);
      }
    }

    // Clear user data from state and localStorage
    setLoggedInPin(null);
    setLoggedInUserName("");
    setLoggedInUserAvatar("");
    setLoggedInUserId(null);
    localStorage.removeItem("userPin");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");
  };

  return (
    <div>
      {loggedInPin && (
        <Header
          userName={loggedInUserName}
          userAvatar={loggedInUserAvatar}
          onLogout={handleLogout}
        />
      )}
      {loggedInPin ? (
        <UsersList loggedInPin={loggedInPin} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
