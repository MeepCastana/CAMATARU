import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import UserList from "./UserList";

const App = () => {
  const [loggedInPin, setLoggedInPin] = useState(
    localStorage.getItem("userPin")
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedInPin ? (
              <UserList loggedInPin={loggedInPin} />
            ) : (
              <Login onLogin={setLoggedInPin} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
