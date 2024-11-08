import React from "react";
import { Link } from "react-router-dom";

const AuthFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Authorization Failed
      </h1>
      <p className="mb-6">
        It seems like the login process was canceled or failed.
      </p>
      <Link
        to="/auth/discord"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Try Logging In Again
      </Link>
    </div>
  );
};

export default AuthFailed;
