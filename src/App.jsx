import React, { useState } from "react";
import Login from "./Login";
import Header from "./Header";
import UsersList from "./UsersList";
import ResetStatus from "./ResetStatus";

const App = () => {
  const [loggedInPin, setLoggedInPin] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState("");
  const [loggedInUserAvatar, setLoggedInUserAvatar] = useState("");
  const [loggedInUserRole, setLoggedInUserRole] = useState(""); // Track user role for permissions

  const handleLogin = (pin, name, avatar, role) => {
    setLoggedInPin(pin);
    setLoggedInUserName(name);
    setLoggedInUserAvatar(avatar);
    setLoggedInUserRole(role); // Set user role on login
  };

  const handleLogout = () => {
    setLoggedInPin(null);
    setLoggedInUserName("");
    setLoggedInUserAvatar("");
    setLoggedInUserRole(""); // Clear role on logout
  };

  return (
    <div>
      {loggedInPin && (
        <>
          <Header
            userName={loggedInUserName}
            userAvatar={loggedInUserAvatar}
            onLogout={handleLogout}
          />
          {/* Only show ResetStatus component if the user is an admin */}
          {loggedInUserRole === "admin" && <ResetStatus />}
        </>
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
