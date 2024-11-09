import React, { useEffect, useState } from "react";

const Header = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Welcome to Camataru</h1>
      {profile ? (
        <div className="flex items-center">
          <img
            src={profile.avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="mr-4">{profile.username}</span>
          <button
            onClick={() => {
              // Add logout logic here if needed
            }}
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
