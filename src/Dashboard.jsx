// Dashboard.jsx
import React from "react";

const Dashboard = ({ user }) => (
  <div>
    <h2>Welcome to the Dashboard, {user ? user.username : "Guest"}!</h2>
    <p>This is the protected dashboard page.</p>
  </div>
);

export default Dashboard;
