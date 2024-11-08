import React from "react";

const LoginWithDiscord = () => {
  const handleLogin = () => {
    window.location.href = "https://camataru.ro/auth/discord"; // Use production backend URL when deployed
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-indigo-500 text-white py-2 px-4 rounded"
    >
      Login with Discord
    </button>
  );
};

export default LoginWithDiscord;
