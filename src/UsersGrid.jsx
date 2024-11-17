import React from "react";
import { motion } from "framer-motion";

const UsersGrid = ({ users, clickedUsers, toggleUser }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
      {users.length === 0 ? (
        <p className="col-span-full text-center text-gray-600">
          No users found.
        </p>
      ) : (
        users.map((user) => (
          <motion.div
            key={user.discord_id}
            className={`p-3 sm:p-4 rounded-lg shadow cursor-pointer transition-colors duration-200 ${
              clickedUsers[user.discord_id] ? "bg-green-500" : "bg-red-800"
            }`}
            onClick={() => toggleUser(user.discord_id, user.pin)}
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
        ))
      )}
    </div>
  );
};

export default UsersGrid;
