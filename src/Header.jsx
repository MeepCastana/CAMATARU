import React from "react";

const Header = ({ userName, userAvatar }) => {
  return (
    <header className="flex items-center p-4 bg-blue-500 text-white">
      <div className="flex items-center space-x-4">
        {userAvatar && (
          <img
            src={userAvatar}
            alt={`${userName}'s avatar`}
            className="w-10 h-10 rounded-full"
          />
        )}
        <h1 className="text-xl font-semibold">
          Welcome, {userName || "Guest"}!
        </h1>
      </div>
    </header>
  );
};

export default Header;
