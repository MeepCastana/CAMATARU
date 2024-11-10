import React, { useState } from "react";
import Login from "./Login";
import Header from "./Header";
import UsersList from "./UsersList";

const App = () => {
  const [loggedInPin, setLoggedInPin] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState("");
  const [loggedInUserAvatar, setLoggedInUserAvatar] = useState("");
  const [clickedUsers, setClickedUsers] = useState({});

  const handleLogin = (pin, name, avatar) => {
    setLoggedInPin(pin);
    setLoggedInUserName(name);
    setLoggedInUserAvatar(avatar);
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
    <div>
      {loggedInPin && (
        <Header
          userName={loggedInUserName}
          userAvatar={loggedInUserAvatar}
          onLogout={handleLogout}
        />
      )}
      {loggedInPin ? (
        <UsersList
          loggedInPin={loggedInPin}
          clickedUsers={clickedUsers}
          setClickedUsers={setClickedUsers}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
