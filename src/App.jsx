import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import AuthFailed from "./AuthFailed";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/dashboard"); // Endpoint to get user session data
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
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

const Dashboard = ({ user }) => (
  <div className="p-4">
    <h2 className="text-2xl font-bold">
      Welcome to the Dashboard, {user?.username || "Guest"}!
    </h2>
    <p>This is the protected dashboard page.</p>
  </div>
);

export default App;
