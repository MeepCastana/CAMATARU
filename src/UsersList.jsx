import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import UsersGrid from "./UsersGrid"; // Import the new component

const socket = io("http://localhost:5000");

const UsersList = ({
  loggedInPin,
  clickedUsers,
  setClickedUsers,
  users,
  toggleUser,
}) => {
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);

        const initialStatus = {};
        let adminStatus = false;

        data.forEach((user) => {
          initialStatus[user.discord_id] = user.status || false;
          if (user.pin === loggedInPin && user.is_admin) {
            adminStatus = true;
          }
        });

        setClickedUsers(initialStatus);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();

    socket.on("status-updated", ({ userId, status }) => {
      setClickedUsers((prev) => ({ ...prev, [userId]: status }));
    });

    socket.on("reset-statuses", () => {
      const resetStatus = {};
      users.forEach((user) => {
        resetStatus[user.discord_id] = false;
      });
      setClickedUsers(resetStatus);
    });

    return () => {
      socket.off("status-updated");
      socket.off("reset-statuses");
    };
  }, [loggedInPin, users]);

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
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Adding a custom header
          },
          body: JSON.stringify({ userId, status: newStatus }),
        });
      } catch (error) {
        console.error("Failed to update user status:", error);
      }
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen flex flex-col items-center justify-center w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-green-500">
        Listed Users
      </h2>
      {isAdmin && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => {}}
            className="bg-yellow-500 text-white px-4 py-2 border-none rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Reset All Statuses
          </button>
          <button
            onClick={() => {}}
            className="bg-blue-500 text-white px-4 py-2 border-none rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Generate Report
          </button>
        </div>
      )}
      {/* Replace the grid with UsersGrid */}
      <UsersGrid
        users={users}
        clickedUsers={clickedUsers}
        toggleUser={toggleUser}
      />

      {showAlert && (
        <AlertModal
          message="Doar tie iti poti schimba statusul."
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
