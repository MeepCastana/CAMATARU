import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Update this URL if needed

const UserList = ({ loggedInPin }) => {
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

    // Listen for status updates
    socket.on("statusUpdate", (updatedStatuses) => {
      setClickedUsers(updatedStatuses);
    });

    // Clean up the event listener
    return () => socket.off("statusUpdate");
  }, []);

  const toggleUser = (userId, userPin) => {
    if (loggedInPin === userPin) {
      socket.emit("toggleStatus", userId); // Emit toggle event to the server
    } else {
      alert("You can only toggle your own status.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Users List</h2>
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
                clickedUsers[user.discord_id] ? "bg-green-500" : "bg-red-500"
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

export default UserList;
