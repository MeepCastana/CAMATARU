import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DragAndDrop({ isAdmin }) {
  const [users, setUsers] = useState([]); // Users in the left box
  const [rightBoxMembers, setRightBoxMembers] = useState([]); // Users in the right box
  const [dragging, setDragging] = useState(false); // State to track drag-over
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");

  useEffect(() => {
    // Fetch users from the backend periodically
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();

        // Split users based on their `paid` field
        setUsers(data.filter((user) => !user.paid)); // Left box
        setRightBoxMembers(data.filter((user) => user.paid)); // Right box
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers(); // Initial fetch
    const interval = setInterval(fetchUsers, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleDragStart =
    (user, fromRightBox = false) =>
    (event) => {
      if (!isAdmin) {
        alert("Only admins can perform this action.");
        return;
      }
      setDragging(true);
      event.dataTransfer.setData("userId", user.id);
      event.dataTransfer.setData("fromRightBox", fromRightBox);
    };

  const handleDrop = async (event, isRightBox) => {
    event.preventDefault();
    setDragging(false);
    if (!isAdmin) {
      alert("Only admins can perform this action.");
      return;
    }

    const userId = parseInt(event.dataTransfer.getData("userId"));
    const fromRightBox = event.dataTransfer.getData("fromRightBox") === "true";

    if (isRightBox && !fromRightBox) {
      // Moving from left to right
      const user = users.find((u) => u.id === userId);
      const info = prompt(`Enter additional information for ${user.name}`);
      if (info !== null) {
        try {
          await fetch("/api/drag-and-drop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, paid: true, info }),
          });
        } catch (error) {
          console.error("Failed to update user:", error);
        }
      }
    } else if (!isRightBox && fromRightBox) {
      // Moving from right to left
      try {
        await fetch("/api/drag-and-drop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, paid: false }),
        });
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
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
      <motion.div
        className={`w-1/2 p-4 rounded shadow ${
          dragging ? "bg-blue-400" : "bg-blue-300"
        }`}
        onDrop={(e) => handleDrop(e, false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.02 }}
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
              className="p-3 sm:p-4 rounded-lg shadow cursor-pointer bg-red-500 text-white"
              draggable={isAdmin}
              onDragStart={handleDragStart(user)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{
                scale: isAdmin ? 1.05 : 1,
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
                {user.display_name || user.username}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Box */}
      <motion.div
        className={`w-1/2 p-4 rounded shadow ${
          dragging ? "bg-green-400" : "bg-green-300"
        }`}
        onDrop={(e) => handleDrop(e, true)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: 1.02 }}
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
              className="p-3 sm:p-4 rounded-lg shadow cursor-pointer bg-white text-black"
              draggable={isAdmin}
              onDragStart={handleDragStart(user, true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{
                scale: isAdmin ? 1.05 : 1,
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
                {user.display_name || user.username}
              </span>
              <p className="text-sm text-gray-600">{user.info}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
