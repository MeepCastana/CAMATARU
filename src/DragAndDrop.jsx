import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";

// Connect to the server
const socket = io("http://localhost:5000");

export default function DragAndDrop() {
  const [users, setUsers] = useState([]);
  const [rightBoxMembers, setRightBoxMembers] = useState([]);
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");

  useEffect(() => {
    // Fetch users from the server
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

    // Listen to updates from the server
    socket.on("user-updated", (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    });

    return () => {
      socket.off("user-updated");
    };
  }, []);

  // Drag start handler
  const handleDragStart =
    (user, fromRightBox = false) =>
    (event) => {
      event.dataTransfer.setData("userId", user.id);
      event.dataTransfer.setData("fromRightBox", fromRightBox);
    };

  // Drop handler for both left and right boxes
  const handleDrop = (event, isRightBox) => {
    event.preventDefault();
    const userId = parseInt(event.dataTransfer.getData("userId"));
    const fromRightBox = event.dataTransfer.getData("fromRightBox") === "true";

    if (isRightBox && !fromRightBox) {
      // Moving from left to right
      const user = users.find((u) => u.id === userId);
      const info = prompt(`Enter additional information for ${user.name}`);
      if (info) {
        const updatedUser = { ...user, info };
        setRightBoxMembers((prev) => [...prev, updatedUser]);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } else if (!isRightBox && fromRightBox) {
      // Moving from right to left (reset info)
      const user = rightBoxMembers.find((u) => u.id === userId);
      const resetUser = { ...user, info: "" };
      setUsers((prev) => [...prev, resetUser]);
      setRightBoxMembers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  // Drag over handler to allow dropping
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Filtered lists based on search inputs
  const filteredUsers = users.filter((user) =>
    (user.display_name || user.username)
      .toLowerCase()
      .includes(searchLeft.toLowerCase())
  );
  const filteredRightBoxMembers = rightBoxMembers.filter((user) =>
    (user.display_name || user.username)
      .toLowerCase()
      .includes(searchRight.toLowerCase())
  );

  return (
    <div className="flex gap-8 p-8">
      {/* Left Box */}
      <div
        className="w-1/2 p-4 bg-blue-300 rounded shadow"
        onDrop={(e) => handleDrop(e, false)}
        onDragOver={handleDragOver}
      >
        <h2 className="text-lg font-bold mb-4 text-center">Available Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchLeft}
          onChange={(e) => setSearchLeft(e.target.value)}
          className="w-full p-2 mb-4 rounded"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              className={`p-3 sm:p-4 rounded-lg shadow cursor-pointer transition-colors duration-200 ${
                user.status ? "bg-green-500" : "bg-red-500"
              }`}
              draggable
              onDragStart={handleDragStart(user)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img
                src={user.avatar || "default-avatar.png"}
                alt={`${user.username}'s avatar`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2"
              />
              <span className="block text-center text-white text-sm sm:text-base font-semibold">
                {user.display_name || user.username}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Box */}
      <div
        className="w-1/2 p-4 bg-green-300 rounded shadow"
        onDrop={(e) => handleDrop(e, true)}
        onDragOver={handleDragOver}
      >
        <h2 className="text-lg font-bold mb-4 text-center">Selected Users</h2>
        <input
          type="text"
          placeholder="Search selected users..."
          value={searchRight}
          onChange={(e) => setSearchRight(e.target.value)}
          className="w-full p-2 mb-4 rounded"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {filteredRightBoxMembers.map((user) => (
            <motion.div
              key={user.id}
              className="p-3 sm:p-4 rounded-lg shadow cursor-pointer bg-white text-black transition-colors duration-200"
              draggable
              onDragStart={handleDragStart(user, true)}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img
                src={user.avatar || "default-avatar.png"}
                alt={`${user.username}'s avatar`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2"
              />
              <span className="block text-center font-semibold">
                {user.name}
              </span>
              <p className="text-sm text-gray-600">{user.info}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
