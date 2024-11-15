import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

// Connect to the server
const socket = io("http://localhost:5000");

export default function DragAndDrop() {
  const [users, setUsers] = useState([]);
  const [rightBoxMembers, setRightBoxMembers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

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

  return (
    <div className="flex gap-8 p-8">
      {/* Left Box */}
      <div
        className="w-1/2 p-4 bg-blue-300 rounded shadow"
        onDrop={(e) => handleDrop(e, false)}
        onDragOver={handleDragOver}
      >
        <h2 className="text-lg font-bold mb-4">Available Users</h2>
        {users.map((user) => (
          <motion.div
            key={user.id}
            className="p-2 bg-white rounded mb-2 cursor-pointer shadow text-black"
            draggable
            onDragStart={handleDragStart(user)}
          >
            {user.name}
          </motion.div>
        ))}
      </div>

      {/* Right Box */}
      <div
        className="w-1/2 p-4 bg-green-300 rounded shadow"
        onDrop={(e) => handleDrop(e, true)}
        onDragOver={handleDragOver}
      >
        <h2 className="text-lg font-bold mb-4">Selected Users</h2>
        {rightBoxMembers.map((user) => (
          <motion.div
            key={user.id}
            className="p-2 bg-white rounded mb-2 cursor-pointer shadow text-black"
            draggable
            onDragStart={handleDragStart(user, true)}
          >
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.info}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
