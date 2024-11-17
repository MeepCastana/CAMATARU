import React from "react";
import { motion } from "framer-motion";

const UserCard = ({
  user,
  isSelected,
  onClick,
  isDraggable,
  onDragStart,
  whileHoverScale = 1.05,
}) => (
  <motion.div
    key={user.discord_id}
    className={`p-3 sm:p-4 rounded-lg shadow cursor-pointer transition-colors duration-200 ${
      isSelected ? "bg-green-500" : "bg-blue-500"
    }`}
    onClick={onClick}
    draggable={isDraggable}
    onDragStart={onDragStart}
    whileHover={{
      scale: whileHoverScale,
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <img
      src={user.avatar || "default-avatar.png"}
      alt={`${user.username}'s avatar`}
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2"
    />
    <span className="block text-center text-white text-sm sm:text-base font-semibold truncate">
      {user.display_name || user.username}
    </span>
  </motion.div>
);

export default UserCard;
