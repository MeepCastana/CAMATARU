import React, { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.discord_id}>
            <img
              src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
              alt={`${user.username}'s avatar`}
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
            <p>
              {user.username} (PIN: {user.pin})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
