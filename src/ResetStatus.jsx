import React from "react";
import { motion } from "framer-motion";

const ResetStatus = () => {
  const handleResetStatus = async () => {
    try {
      const response = await fetch("/api/reset-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Adding a custom header
        },
      });

      if (response.ok) {
        alert("All statuses have been reset!");
      } else {
        alert("Failed to reset statuses.");
      }
    } catch (error) {
      console.error("Error resetting statuses:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={handleResetStatus}
        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
      >
        Reset Status
      </button>
    </motion.div>
  );
};

export default ResetStatus;
