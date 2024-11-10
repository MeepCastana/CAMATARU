import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    // Store the PIN in localStorage and call the onLogin function
    localStorage.setItem("userPin", pin);
    onLogin(pin);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Enter your PIN to log in</h2>
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Enter PIN"
        className="p-2 border rounded mb-4 text-center"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Log In
      </button>
    </div>
  );
};

export default Login;
