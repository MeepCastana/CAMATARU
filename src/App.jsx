import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UsersList from "./UsersList";
import ContentTest from "./ContentTest";

const App = () => {
  return (
    <Router>
      <ContentTest />
      <Routes>
        <Route path="/users" element={<UsersList />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;
