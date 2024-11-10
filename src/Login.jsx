import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();

      if (data.error) {
        setError("Invalid PIN. Please try again.");
      } else {
        setUser(data.user);
        onLogin(data.user); // Pass the logged-in user data to the parent component
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Failed to log in. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      {user ? (
        <div>
          <h2>Welcome, {user.username}!</h2>
          <img
            src={user.avatar || "default-avatar.png"}
            alt={`${user.username}'s avatar`}
            width={80}
          />
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
