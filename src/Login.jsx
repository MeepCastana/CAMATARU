import React, { useState, useEffect } from "react";

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState(null);

  useEffect(() => {
    // Check if there's a saved PIN in localStorage to keep the user logged in
    const savedPin = localStorage.getItem("userPin");
    const savedName = localStorage.getItem("userName");
    const savedAvatar = localStorage.getItem("userAvatar");

    if (savedPin && savedName && savedAvatar) {
      onLogin(savedPin, savedName, savedAvatar);
    }

    // Check if the user is locked out
    const lockoutTime = localStorage.getItem("lockoutTime");
    if (lockoutTime) {
      const timeRemaining =
        10 * 60 * 1000 - (Date.now() - parseInt(lockoutTime, 10));
      if (timeRemaining > 0) {
        setIsLockedOut(true);
        startCountdown(timeRemaining);
      } else {
        // If lockout time has expired, clear it
        localStorage.removeItem("lockoutTime");
      }
    }
  }, [onLogin]);

  const startCountdown = (timeRemaining) => {
    setLockoutCountdown(timeRemaining);

    const interval = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setIsLockedOut(false);
          setError("");
          setAttempts(0);
          localStorage.removeItem("lockoutTime");
          return null;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const handleLogin = async () => {
    if (isLockedOut) {
      return;
    }

    if (attempts >= 3) {
      const lockoutTime = Date.now();
      localStorage.setItem("lockoutTime", lockoutTime);
      setIsLockedOut(true);
      startCountdown(10 * 60 * 1000); // 10 minutes in milliseconds
      return;
    }

    try {
      // Verify the PIN with the backend
      const response = await fetch("/api/verify-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Adding a custom header
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Fetch user details based on the verified PIN
        const userResponse = await fetch(`/api/get-user-by-pin/${pin}`, {
          headers: {
            "X-Requested-With": "XMLHttpRequest", // Adding a custom header
          },
        });
        const userData = await userResponse.json();

        if (userResponse.ok && userData) {
          localStorage.setItem("userPin", pin);
          localStorage.setItem("userName", userData.name);
          localStorage.setItem("userAvatar", userData.avatar);

          onLogin(pin, userData.name, userData.avatar, userData.id);
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

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-screen">
      <div className="flex flex-col items-center justify-center ">
        <h2 className="text-2xl font-bold mb-4">Enter your PIN to log in</h2>
        <input
          type="tel"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
          className="p-2 border rounded mb-4 text-center"
          maxLength={4}
          disabled={isLockedOut} // Disable input if locked out
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLockedOut}
        >
          Log In
        </button>
        {attempts > 0 && !isLockedOut && (
          <p className="text-gray-500 mt-2">Attempts left: {3 - attempts}</p>
        )}
        {isLockedOut && (
          <p className="text-red-500 mt-2">
            Too many attempts. Please try again in{" "}
            {formatTime(lockoutCountdown)}.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
