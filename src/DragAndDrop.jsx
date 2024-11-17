import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DragAndDrop({
  loggedInPin,
  clickedUsers,
  setClickedUsers,
  isAdmin,
  users,
  setUsers,
}) {
  const [rightBoxMembers, setRightBoxMembers] = useState([]); // Users in the right box
  const [dragging, setDragging] = useState(false); // State to track drag-over
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");

  useEffect(() => {
    // Filter users into unpaid and paid categories
    setRightBoxMembers(users.filter((user) => user.paid));
  }, [users]);

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

    try {
      // Define the "paid" status based on the box
      const paid = isRightBox && !fromRightBox;

      // Make API call to update the user's "paid" status
      const response = await fetch("https://camataru.ro/api/drag-and-drop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include", // Ensure cookies are included
        body: JSON.stringify({
          userId,
          paid,
          info: "Test Info",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Fetch updated users after the API call
      const updatedUsers = await fetch("https://camataru.ro/api/users");
      const data = await updatedUsers.json();
      setUsers(data);

      // Sync the clickedUsers state
      const initialStatus = {};
      data.forEach((user) => {
        initialStatus[user.discord_id] = user.status || false;
      });
      setClickedUsers(initialStatus);
    } catch (error) {
      console.error("Failed to update user:", error);
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
  const filteredUsers = (users || []).filter(
    (user) =>
      !user.paid &&
      (user.display_name || user.username)
        .toLowerCase()
        .includes(searchLeft.toLowerCase())
  );
  const filteredRightBoxMembers = (users || []).filter(
    (user) =>
      user.paid &&
      (user.display_name || user.username)
        .toLowerCase()
        .includes(searchRight.toLowerCase())
  );

  return (
    <div className="flex gap-8 p-8">
      {/* Left Box */}
      <div
        className={`w-1/2 p-4 rounded shadow bg-blue-300`}
        onDrop={(e) => handleDrop(e, false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
              className={`p-3 sm:p-4 rounded-lg shadow cursor-pointer bg-red-800 text-white ${
                clickedUsers[user.discord_id] ? "bg-green-500" : "bg-red-500"
              }`}
              draggable={isAdmin}
              onDragStart={handleDragStart(user)}
              whileHover={{
                scale: isAdmin ? 1.05 : 1,
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
              }}
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
      </div>

      {/* Right Box */}
      <div
        className={`w-1/2 p-4 rounded shadow bg-green-800`}
        onDrop={(e) => handleDrop(e, true)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
              whileHover={{
                scale: isAdmin ? 1.05 : 1,
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
              }}
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
      </div>
    </div>
  );
}
