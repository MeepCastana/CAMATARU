import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (attempts >= 3) {
      setError("Maximum login attempts exceeded. Please try again later.");
      return;
    }

    try {
      // Verify the PIN with the backend
      const response = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Fetch user details based on the verified PIN
        const userResponse = await fetch(`/api/get-user-by-pin/${pin}`);
        const userData = await userResponse.json();

        if (userResponse.ok && userData) {
          // Store the PIN in localStorage
          localStorage.setItem("userPin", pin);

          // Pass user details to the parent component
          onLogin(pin, userData.name, userData.avatar);
        }
      } else {
        setAttempts((prev) => prev + 1);
        setError("Incorrect PIN. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying PIN:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-screen">
      <div className="flex flex-col items-center justify-center ">
        <h2 className="text-2xl font-bold mb-4">Enter your PIN to log in</h2>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
          className="p-2 border rounded mb-4 text-center"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={attempts >= 3}
        >
          Log In
        </button>
        {attempts > 0 && (
          <p className="text-gray-500 mt-2">Attempts left: {3 - attempts}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
