import React, { useEffect, useState } from "react";
import UserCard from "./UserCard"; // Reusable UserCard component

export default function DragAndDrop({
  loggedInPin,
  clickedUsers,
  setClickedUsers,
  isAdmin,
  users,
  setUsers,
}) {
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://camataru.ro/api/users", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers(); // Initial fetch
  }, [setUsers]);

  const handleDragStart =
    (user, fromRightBox = false) =>
    (event) => {
      if (!isAdmin) {
        setShowAlert(true); // Show alert for non-admins
        return;
      }

      // Set data for drag-and-drop
      event.dataTransfer.setData("userId", user.discord_id);
      event.dataTransfer.setData("fromRightBox", fromRightBox);
    };

  const handleDrop = async (event, isRightBox) => {
    event.preventDefault();
    const userId = event.dataTransfer.getData("userId");
    const fromRightBox = event.dataTransfer.getData("fromRightBox") === "true";

    if (!userId) {
      console.error("Invalid userId:", userId);
      alert("Invalid user. Please try again.");
      return;
    }

    try {
      const paid = isRightBox && !fromRightBox;

      const response = await fetch("https://camataru.ro/api/drag-and-drop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, paid, info: "N/A" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const updatedUsers = await response.json();
      console.log("User updated successfully:");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("An error occurred while updating the user. Please try again.");
    }
  };

  const handleReset = async () => {
    if (!isAdmin) {
      setShowAlert(true); // Non-admins cannot reset
      return;
    }

    try {
      const response = await fetch(
        "https://camataru.ro/api/reset-paid-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paid: null }), // Specify the new status
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset user statuses");
      }

      const updatedUsers = await response.json();
      setUsers(updatedUsers); // Update users after resetting their paid status
      console.log("All users moved to unpaid successfully");
    } catch (error) {
      console.error("Failed to reset paid statuses:", error);
      alert("An error occurred while resetting. Please try again.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      !user.paid &&
      (user.display_name || user.username)
        .toLowerCase()
        .includes(searchLeft.toLowerCase())
  );

  const filteredRightBoxMembers = users.filter(
    (user) =>
      user.paid &&
      (user.display_name || user.username)
        .toLowerCase()
        .includes(searchRight.toLowerCase())
  );

  return (
    <>
      <div className="justify-center p-4 flex">
        {isAdmin && (
          <button
            onClick={handleReset}
            className="bg-yellow-500 text-white rounded-md hover:bg-yellow-600 self-center px-4 py-2"
          >
            Resetează toate utilizatorii
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-8 p-8">
        {/* Left Box */}
        <div
          className="w-full md:w-1/2 p-4 rounded-2xl bg-zinc-900 shadow"
          onDrop={(e) => handleDrop(e, false)}
          onDragOver={(e) => e.preventDefault()}
        >
          <h2 className="text-lg font-bold mb-4 text-center text-red-600">
            Taxa neplatita
          </h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Cauta..."
              value={searchLeft}
              onChange={(e) => setSearchLeft(e.target.value)}
              className="w-full p-3 rounded-md bg-zinc-800 focus:outline-none"
            />
            <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={clickedUsers[user.discord_id]}
                onDragStart={handleDragStart(user)}
                isDraggable={isAdmin}
              />
            ))}
          </div>
        </div>

        {/* Right Box */}
        <div
          className="w-full md:w-1/2 p-4 rounded-2xl bg-zinc-900 shadow"
          onDrop={(e) => handleDrop(e, true)}
          onDragOver={(e) => e.preventDefault()}
        >
          <h2 className="text-lg font-bold mb-4 text-center text-green-600">
            Taxă platita
          </h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Caută..."
              value={searchRight}
              onChange={(e) => setSearchRight(e.target.value)}
              className="w-full p-3 rounded-md bg-zinc-800 focus:outline-none"
            />
            <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredRightBoxMembers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={clickedUsers[user.discord_id]}
                onDragStart={handleDragStart(user, true)}
                isDraggable={isAdmin}
              />
            ))}
          </div>
        </div>

        {/* Alert Modal */}
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <p className="text-gray-800 font-semibold">
                Nu poti modifica prezenta altor utilizatori, decat a ta.
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Inchide
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
