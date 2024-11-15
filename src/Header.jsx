import React from "react";
import { Link } from "react-router-dom";

const Header = ({ userName, userAvatar, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b text-white">
      <Link to="/">
        <div className="flex items-center space-x-4">
          {/* Display the user's avatar if available */}
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={`${userName || "User"}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
              {/* Placeholder if no avatar */}
              <span className="text-white font-semibold">?</span>
            </div>
          )}

          {/* Display the user's name or 'Guest' */}
        </div>
      </Link>
      <div className="flex justify-between space-x-2">
        <div>
          <Link to="/users">
            <button className="bg-yellow-500 text-white  hover:bg-yellow-700 transition-all duration-150 ease-in-out max-sm:rounded-3xl px-4 py-2">
              <span className="sm:inline hidden">👥Membri👥</span>
              <span className="sm:hidden inline">👥</span>
            </button>
          </Link>
        </div>

        <div>
          <Link to="/test">
            <button className="bg-blue-500 text-white hover:bg-blue-700 transition-all duration-150 ease-in-out max-sm:rounded-3xl px-4 py-2">
              <span className="sm:inline hidden">💸Taxa💸</span>

              {/* Show on mobile, hide on larger screens */}
              <span className="sm:hidden inline">💸</span>
            </button>
          </Link>
        </div>
        {/* Logout Button */}
        {onLogout && (
          <Link>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white hover:bg-red-700 transition duration-150 rounded-md max-sm:rounded-3xl px-4 py-2"
            >
              {/* Show on larger screens, hide on mobile */}
              <span className="sm:inline hidden">🔓Logout🔓</span>

              {/* Show on mobile, hide on larger screens */}
              <span className="sm:hidden inline">🔓</span>
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
