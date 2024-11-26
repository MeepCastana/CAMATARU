import React, { useState, useEffect } from "react";

const Blob = ({ className }) => (
  <div className={`absolute blur-2xl opacity-30 ${className}`}>
    <div className="w-32 h-32 rounded-full"></div>
  </div>
);

const Login = ({ onLogin }) => {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState(null);

  useEffect(() => {
    const savedPin = localStorage.getItem("userPin");
    const savedName = localStorage.getItem("userName");
    const savedAvatar = localStorage.getItem("userAvatar");

    if (savedPin && savedName && savedAvatar) {
      onLogin(savedPin, savedName, savedAvatar);
    }

    const lockoutTime = localStorage.getItem("lockoutTime");
    if (lockoutTime) {
      const timeRemaining =
        10 * 60 * 1000 - (Date.now() - parseInt(lockoutTime, 10));
      if (timeRemaining > 0) {
        setIsLockedOut(true);
        startCountdown(timeRemaining);
      } else {
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
    if (isLockedOut) return;

    if (attempts >= 3) {
      const lockoutTime = Date.now();
      localStorage.setItem("lockoutTime", lockoutTime);
      setIsLockedOut(true);
      startCountdown(10 * 60 * 1000);
      return;
    }

    try {
      const response = await fetch("https://camataru.ro/api/verify-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ pin }),
        credentials: "include", // Required for sending cookies
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const userResponse = await fetch(
          `https://camataru.ro/api/get-user-by-pin/${pin}`,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );
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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Animated blobs spread across the screen */}
      <Blob className="top-[10%] left-[15%] bg-purple-300 animate-blob-1" />
      <Blob className="top-[20%] right-[20%] bg-blue-300 animate-blob-2" />
      <Blob className="top-[40%] left-[25%] bg-teal-300 animate-blob-3" />
      <Blob className="bottom-[30%] right-[30%] bg-pink-300 animate-blob-4" />
      <Blob className="bottom-[20%] left-[40%] bg-indigo-300 animate-blob-1 animation-delay-2000" />
      <Blob className="bottom-[40%] right-[15%] bg-cyan-300 animate-blob-2 animation-delay-4000" />
      <Blob className="top-[60%] left-[60%] bg-rose-300 animate-blob-3 animation-delay-3000" />
      <Blob className="top-[30%] right-[40%] bg-emerald-300 animate-blob-4 animation-delay-5000" />
      <Blob className="top-[60%] left-[80%] bg-rose-300 animate-blob-3 animation-delay-3000" />
      <Blob className="top-[30%] right-[90%] bg-emerald-300 animate-blob-4 animation-delay-5000" />
      <Blob className="top-[70%] left-[80%] bg-rose-300 animate-blob-3 animation-delay-3000" />
      <Blob className="top-[80%] right-[95%] bg-emerald-300 animate-blob-4 animation-delay-5000" />

      {/* Additional blobs for more coverage */}
      <Blob className="top-[80%] left-[10%] bg-violet-300 animate-blob-2 animation-delay-1000" />
      <Blob className="bottom-[10%] right-[50%] bg-sky-300 animate-blob-3 animation-delay-3500" />
      <Blob className="top-[15%] left-[45%] bg-fuchsia-300 animate-blob-4 animation-delay-4500" />
      <Blob className="bottom-[60%] right-[25%] bg-lime-300 animate-blob-1 animation-delay-2500" />
      <Blob className="top-[15%] left-[10%] bg-fuchsia-300 animate-blob-4 animation-delay-4500" />
      <Blob className="bottom-[60%] right-[5%] bg-lime-300 animate-blob-1 animation-delay-2500" />

      {/* Semi-transparent overlay with reduced blur for better blob visibility */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      {/* Login container */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h2 className="text-3xl font-bold text-white">MERGE IN TIMP REAL</h2>
          <p className="text-lg text-gray-300 text-center">
            Codul PIN il gasesti pe discord cu comanda <code>!pin</code>
          </p>

          <input
            type="tel"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full max-w-[200px] p-4 text-center text-2xl bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
            maxLength={4}
            disabled={isLockedOut}
          />

          {error && (
            <p className="text-red-400 text-center font-medium">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={isLockedOut}
            className="w-full max-w-[200px] py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Log In
          </button>

          {attempts > 0 && !isLockedOut && (
            <p className="text-gray-300">Attempts remaining: {3 - attempts}</p>
          )}

          {isLockedOut && (
            <p className="text-red-400 font-medium">
              Too many attempts. Try again in {formatTime(lockoutCountdown)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Login;
