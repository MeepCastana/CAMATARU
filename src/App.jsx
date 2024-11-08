import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Dashboard from "./Dashboard";
import AuthFailed from "./AuthFailed";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/dashboard", {
          credentials: "include", // Ensures cookies are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User data fetched:", data);
          setUser(data.user); // Update user state with the fetched user data
        } else {
          console.error("Failed to fetch user:", response.status);
          setUser(null); // Clear user state if not logged in
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Header user={user} /> {/* Header will always be displayed */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/auth-failed" element={<AuthFailed />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
