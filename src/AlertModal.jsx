import React from "react";
import { motion } from "framer-motion";

const AlertModal = ({ message, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 shadow-lg w-80 text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{message}</h2>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          OK
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AlertModal;
