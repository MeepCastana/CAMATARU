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

  return (
    <div>
      <Header userName={loggedInUserName} userAvatar={loggedInUserAvatar} />
      {loggedInPin ? (
        <UsersList loggedInPin={loggedInPin} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
