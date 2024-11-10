import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

// Connect to the backend server (adjust URL if needed)
const socket = io("http://localhost:5000"); // Replace with your backend URL if necessary

const AlertModal = ({ message, onClose }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg p-6 shadow-lg w-11/12 sm:w-80 text-center relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          {message}
        </h2>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          OK
        </button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const UsersList = ({ loggedInPin, loggedInUserName, loggedInUserAvatar }) => {
  const [users, setUsers] = useState([]);
  const [clickedUsers, setClickedUsers] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if logged-in user is an admin

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);

        // Set initial clickedUsers state and check if the logged-in user is an admin
        const initialStatus = {};
        let adminStatus = false;

        data.forEach((user) => {
          initialStatus[user.discord_id] = user.status || false;
          if (user.pin === loggedInPin && user.is_admin) {
            adminStatus = true; // Identify if the logged-in user has admin rights
          }
        });

        setClickedUsers(initialStatus);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();

    // Listen for real-time updates from the backend
    socket.on("status-updated", ({ userId, status }) => {
      setClickedUsers((prev) => ({ ...prev, [userId]: status }));
    });

    // Cleanup on unmount
    return () => {
      socket.off("status-updated");
    };
  }, [loggedInPin]);

  const toggleUser = async (userId, userPin) => {
    if (loggedInPin === userPin) {
      const newStatus = !clickedUsers[userId];
      setClickedUsers((prev) => ({
        ...prev,
        [userId]: newStatus,
      }));

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
      setShowAlert(true);
    }
  };

  const resetStatuses = async () => {
    try {
      // Make a request to reset all users' statuses in the backend
      await fetch("/api/reset-statuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      // Reset local state to reflect the reset statuses
      const resetStatus = {};
      users.forEach((user) => {
        resetStatus[user.discord_id] = false;
      });
      setClickedUsers(resetStatus);
    } catch (error) {
      console.error("Failed to reset user statuses:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-green-500">
        Listed Users
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4 w-full max-w-screen">
        {users.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No users found.
          </p>
        ) : (
          users.map((user) => (
            <motion.div
              key={user.discord_id}
              className={`p-3 sm:p-4 rounded-lg shadow cursor-pointer transition-colors duration-200 ${
                clickedUsers[user.discord_id] ? "bg-green-500" : "bg-red-500"
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

      {/* Conditionally render the Reset Status button if the user is an admin */}
      {isAdmin && (
        <button
          onClick={resetStatuses}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Reset All Statuses
        </button>
      )}

      {/* Render the alert modal conditionally */}
      {showAlert && (
        <AlertModal
          message="Poți schimba doar statusul tău!"
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
