import React from "react";

const Header = ({ userName, userAvatar, onLogout }) => {
  return (
    <header className="w-full bg-blue-600 p-4 flex items-center justify-between sm:justify-end">
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <img
          src={userAvatar || "default-avatar.png"}
          alt={`${userName}'s avatar`}
          className="w-10 h-10 rounded-full border-2 border-white"
        />

        {/* Username */}
        <span className="text-white font-semibold hidden sm:inline-block">
          {userName || "Guest"}
        </span>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
