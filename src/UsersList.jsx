import React, { useEffect, useState } from "react";
import "./UserList.css"; // Add CSS for custom styling

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [clickedUsers, setClickedUsers] = useState({});

  useEffect(() => {
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
  }, []);

  const toggleUser = (userId) => {
    setClickedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <div className="user-list-container">
      <h2>Users List</h2>
      <div className="user-grid">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.discord_id}
              className={`user-card ${
                clickedUsers[user.discord_id] ? "green" : "red"
              }`}
              onClick={() => toggleUser(user.discord_id)}
            >
              <img
                src={user.avatar || "default-avatar.png"}
                alt={`${user.username}'s avatar`}
                width={50}
              />
              <span>{user.username}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
