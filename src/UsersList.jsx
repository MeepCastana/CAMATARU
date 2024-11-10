import React, { useEffect, useState } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);

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

  return (
    <div>
      <h2>Users List</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.discord_id}>
              <img
                src={user.avatar || "default-avatar.png"}
                alt={`${user.username}'s avatar`}
                width={50}
              />

              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
