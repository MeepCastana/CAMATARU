import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserCard from "./UserCard"; // Import the reusable UserCard component
import * as XLSX from "xlsx"; // For generating the report

const UsersList = ({ loggedInPin, clickedUsers, setClickedUsers }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // To handle filtered users
  const [searchText, setSearchText] = useState(""); // For the search bar
  const [showAlert, setShowAlert] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Poll users from the database every 2 seconds
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://camataru.ro/api/users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Initialize filteredUsers with all users

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

    fetchUsers();
    const interval = setInterval(fetchUsers, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [loggedInPin, setClickedUsers]);

  // Handle search input
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredUsers(users); // Reset filtered users if search text is empty
    } else {
      const filtered = users.filter((user) =>
        (user.display_name || user.username)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchText, users]);

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
      .map((user) => [user.display_name || user.username, "Active"]);

    const inactiveUsers = users
      .filter((user) => !clickedUsers[user.discord_id])
      .map((user) => [user.display_name || user.username, "Inactive"]);

    const headers = ["Username", "Status"];
    const dataSheet = [headers, ...activeUsers, ...inactiveUsers];

    const worksheet = XLSX.utils.aoa_to_sheet(dataSheet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Report");

    XLSX.writeFile(workbook, "UsersReport.xlsx");
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen flex flex-col items-center justify-center w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-white  ">
        Lista Prezenta
      </h2>

      {/* Admin actions */}
      {isAdmin && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={resetStatuses}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Reseteaza Prezenta
          </button>
          <button
            onClick={generateReport}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Genereaza Raport
          </button>
        </div>
      )}

      {/* Search bar */}
      <div className="w-full mb-6">
        <input
          type="text"
          placeholder="Cauta membrii..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full p-3 rounded-md bg-zinc-900  focus:outline-none"
        />
      </div>

      {/* User cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.discord_id}
            user={user}
            isSelected={clickedUsers[user.discord_id]}
            onClick={() => toggleUser(user.discord_id, user.pin)}
          />
        ))}
      </div>

      {/* Alert modal */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <p className="text-gray-800 font-semibold">
              Nu poti modifica prezenta altor utilizatori, decat a ta.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Inchide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
