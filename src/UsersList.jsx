import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Connect to the backend server (adjust URL if needed)
const socket = io("http://localhost:5000"); // Replace with your backend URL if necessary

const UsersList = ({ loggedInPin, loggedInUserName, loggedInUserAvatar }) => {
  const [users, setUsers] = useState([]);
  const [clickedUsers, setClickedUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users from /api/users...");
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
        console.log("Fetched users:", data);

        const initialStatus = {};
        data.forEach((user) => {
          initialStatus[user.discord_id] = user.status || false;
        });
        setClickedUsers(initialStatus);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();

    // Listen for real-time updates from the backend
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Connected to socket server with ID:", socket.id);
    });

    socket.on("status-updated", ({ userId, status }) => {
      console.log(
        `Received status update for user ${userId} with status ${status}`
      );
      setClickedUsers((prev) => ({ ...prev, [userId]: status }));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Cleanup on unmount
    return () => {
      socket.off("status-updated");
      socket.disconnect();
    };
  }, [loggedInPin]);

  const toggleUser = async (userId, userPin, userName, userProfilePicture) => {
    if (loggedInPin === userPin) {
      const newStatus = !clickedUsers[userId];
      setClickedUsers((prev) => ({
        ...prev,
        [userId]: newStatus,
      }));

      try {
        console.log(
          `Sending toggle request for user ${userId} with status ${newStatus}`
        );
        await fetch("/api/toggle-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, status: newStatus }),
        });
      } catch (error) {
        console.error("Failed to update user status:", error);
      }
    } else {
      // Alert the logged-in user's name and profile picture to indicate their profile
      alert(
        `Poți schimba doar statusul tău! \n\nNume: ${loggedInUserName}\nProfil: ${loggedInUserAvatar}`
      );
    }
  };

  return (
    <div className="p-6 min-h-screen items-center justify-center">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
        Listed Users
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        {users.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No users found.
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.discord_id}
              className={`p-4 border rounded-lg shadow cursor-pointer transition-colors duration-200 ${
                clickedUsers[user.discord_id] ? "bg-blue-500" : "bg-red-500"
              }`}
              onClick={() =>
                toggleUser(
                  user.discord_id,
                  user.pin,
                  user.display_name || user.username,
                  user.avatar
                )
              }
            >
              <img
                src={user.avatar || "default-avatar.png"}
                alt={`${user.username}'s avatar`}
                className="w-12 h-12 rounded-full mx-auto mb-2"
              />
              <span className="block text-center text-white font-semibold">
                {user.display_name || user.username}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersList;
