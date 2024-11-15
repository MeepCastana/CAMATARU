import React from "react";
import { Link } from "react-router-dom";

const Header = ({ userName, userAvatar, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b text-white">
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
      <div className="flex justify-around space-x-5">
        <div>
          <Link to="/users">
            <button className="bg-yellow-500 text-white  hover:bg-yellow-700 transition-all duration-150 ease-in-out">
              👥Membri👥
            </button>
          </Link>
        </div>

        <div>
          <Link to="/test">
            <button className="bg-blue-500 text-white hover:bg-blue-700 transition-all duration-150 ease-in-out">
              💸Taxa💸
            </button>
          </Link>
        </div>
      </div>
      {/* Logout Button */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-red-500 text-white  hover:bg-red-700 transition duration-150"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
