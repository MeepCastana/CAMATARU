import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthFailed from "./AuthFailed";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import ContentTest from "./ContentTest";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/dashboard", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <ContentTest />
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/auth-failed" element={<AuthFailed />} />
      </Routes>
    </Router>
  );
};

export default App;
