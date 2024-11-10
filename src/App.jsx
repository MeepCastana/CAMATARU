import React, { useState } from "react";
import Login from "./Login";
import Header from "./Header";
import UsersList from "./UsersList";

const App = () => {
  const [loggedInPin, setLoggedInPin] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState("");
  const [loggedInUserAvatar, setLoggedInUserAvatar] = useState("");

  const handleLogin = (pin, name, avatar) => {
    setLoggedInPin(pin);
    setLoggedInUserName(name);
    setLoggedInUserAvatar(avatar);
  };

  const handleLogout = () => {
    // Clear session data from localStorage
    localStorage.removeItem("userPin");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");

    // Reset the logged-in state
    setLoggedInPin(null);
    setLoggedInUserName("");
    setLoggedInUserAvatar("");
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
