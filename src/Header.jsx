import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "GET",
        credentials: "include", // Ensures cookies are included in the request
      });
      navigate("/"); // Redirect to the home page after logout
      window.location.reload(); // Reload to update session state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Welcome to Camataru</h1>
      {user ? (
        <div className="flex items-center">
          <img
            src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="mr-4">{user.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      ) : (
        <a
          href="/auth/discord"
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Login with Discord
        </a>
      )}
    </header>
  );
};

export default Header;
