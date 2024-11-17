import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UsersGrid from "./UsersGrid";

const UsersList = ({ loggedInPin, clickedUsers, setClickedUsers }) => {
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

    fetchUsers(); // Initial fetch
    const interval = setInterval(fetchUsers, 3000); // Poll every 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [loggedInPin, setClickedUsers]);

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
            onClick={() => {
              setClickedUsers({});
              setUsers([]);
            }}
            className="bg-yellow-500 text-white px-4 py-2 border-none rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Reset All Statuses
          </button>
        </div>
      )}
      <UsersGrid
        users={users}
        clickedUsers={clickedUsers}
        toggleUser={toggleUser}
      />
      {showAlert && (
        <div className="bg-red-500 text-white p-4 rounded mt-4">
          Only you can toggle your own status.
        </div>
      )}
    </div>
  );
};

export default UsersList;
