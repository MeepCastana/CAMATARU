// HomePage.js
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h2>Welcome to Camataru.ro</h2>
      <Link to="/users">
        <button>View Users List</button>
      </Link>
      {/* Add other navigation buttons if needed */}
    </div>
  );
};

export default HomePage;
