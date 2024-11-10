import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(); // Connect to the server's root URL

const UsersList = ({ loggedInPin }) => {
  const [users, setUsers] = useState([]);
  const [clickedUsers, setClickedUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();

    // Listen for real-time updates
    socket.on("status-updated", ({ userId, status }) => {
      setClickedUsers((prev) => ({ ...prev, [userId]: status }));
    });

    return () => {
      socket.off("status-updated");
    };
  }, []);

  const toggleUser = async (userId, userPin) => {
    if (loggedInPin === userPin) {
      const newStatus = !clickedUsers[userId];

      try {
        await fetch("/api/toggle-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, status: newStatus }),
        });
      } catch (error) {
        console.error("Failed to update user status:", error);
      }
    } else {
      alert("You can only toggle your own status.");
    }
  };

  return (
    <div className="p-6 bg-green-500 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
        Users List
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No users found.
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.discord_id}
              className={`p-4 border rounded-lg shadow cursor-pointer transition-colors duration-200 ${
                clickedUsers[user.discord_id] ? "bg-green-500" : "bg-blue-500"
              }`}
              onClick={() => toggleUser(user.discord_id, user.pin)}
            >
              <img
                src={user.avatar || "default-avatar.png"}
                alt={`${user.username}'s avatar`}
                className="w-12 h-12 rounded-full mx-auto mb-2"
              />
              <span className="block text-center text-white font-semibold">
                {user.username}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersList;
