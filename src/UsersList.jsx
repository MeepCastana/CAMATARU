import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

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

const UsersList = ({ loggedInPin, clickedUsers, setClickedUsers }) => {
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Poll users from the database every 2 seconds
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://camataru.ro/api/users");
        const data = await response.json();
        setUsers(data);

        // Set the admin status and clicked user states
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

    fetchUsers(); // Initial fetch
    const interval = setInterval(fetchUsers, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [loggedInPin, setClickedUsers]);

  const toggleUser = async (userId, userPin) => {
    if (loggedInPin === userPin) {
      const newStatus = !clickedUsers[userId];
      setClickedUsers((prev) => ({
        ...prev,
        [userId]: newStatus,
      }));

      try {
        await fetch("https://camataru.ro/api/toggle-status", {
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

  const resetStatuses = async () => {
    try {
      await fetch("https://camataru.ro/api/reset-statuses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Adding a custom header
        },
      });
      setClickedUsers({});
    } catch (error) {
      console.error("Failed to reset user statuses:", error);
    }
  };

  const generateReport = () => {
    const activeUsers = users
      .filter((user) => clickedUsers[user.discord_id])
      .map((user) => [
        user.display_name || user.username,
        "", // Spacer column
        "", // Spacer column
        "Prezent",
      ]);

    const inactiveUsers = users
      .filter((user) => !clickedUsers[user.discord_id])
      .map((user) => [
        user.display_name || user.username,
        "", // Spacer column
        "", // Spacer column
        "Absent",
      ]);

    if (activeUsers.length === 0 && inactiveUsers.length === 0) {
      setShowAlert(true); // Show alert if no users to report
      return;
    }

    const headers = ["Display Name", "", "", "Status"];
    const activeSheetData = [headers, [], ...activeUsers];
    const inactiveSheetData = [headers, [], ...inactiveUsers];

    const activeSheet = XLSX.utils.aoa_to_sheet(activeSheetData);
    const inactiveSheet = XLSX.utils.aoa_to_sheet(inactiveSheetData);

    activeSheet["!cols"] = [{ wch: 30 }, { wch: 5 }, { wch: 5 }, { wch: 15 }];
    inactiveSheet["!cols"] = [{ wch: 30 }, { wch: 5 }, { wch: 5 }, { wch: 15 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, activeSheet, "Active Users");
    XLSX.utils.book_append_sheet(workbook, inactiveSheet, "Inactive Users");

    XLSX.writeFile(workbook, "UsersReport.xlsx");
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen flex flex-col items-center justify-center w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-green-500">
        Listed Users
      </h2>
      {isAdmin && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={resetStatuses}
            className="bg-yellow-500 text-white px-4 py-2 border-none  rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Reset All Statuses
          </button>
          <button
            onClick={generateReport}
            className="bg-blue-500 text-white px-4 py-2 border-none rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Generate Report
          </button>
        </div>
      )}
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
