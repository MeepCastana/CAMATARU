import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0); // Track login attempts
  const [error, setError] = useState(""); // Error message for incorrect PIN or max attempts

  const handleLogin = async () => {
    // If the user has reached 3 attempts, prevent further login attempts
    if (attempts >= 3) {
      setError("Maximum login attempts exceeded. Please try again later.");
      return;
    }

    try {
      // Make a request to verify the PIN in the database
      const response = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store the PIN in localStorage and call the onLogin function
        localStorage.setItem("userPin", pin);
        onLogin(pin);
      } else {
        // Increment attempts and show error if the PIN is incorrect
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
        {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
        {/* Show error message */}
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={attempts >= 3} // Disable the button after 3 attempts
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
