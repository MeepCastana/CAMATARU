import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import "./App.css";
import AuthFailed from "./AuthFailed";
import ContentTest from "./src/ContentTest";

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
      <Header user={user} />
      <ContentTest />
      <Routes>
        <Route path="/auth-failed" element={<AuthFailed />} />
        {/* Other routes go here */}
      </Routes>
    </Router>
  );
};

export default App;
