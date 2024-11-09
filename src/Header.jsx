import React from "react";

const Header = ({ user }) => (
  <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
    <h1 className="text-xl font-bold">Welcome to Camataru</h1>
    {user ? (
      <div className="flex items-center">
        <img
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="mr-4">{user.username}</span>
        <a
          href="/logout"
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Log Out
        </a>
      </div>
    ) : (
      <a
        href="/auth/discord"
        className="bg-red-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        <span className=" text-green-700">Login with Discord </span>
      </a>
    )}
  </header>
);

export default Header;
