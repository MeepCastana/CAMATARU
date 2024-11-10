import React from "react";

const Header = ({ userName, userAvatar, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b text-white ">
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

      {/* Logout Button */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
