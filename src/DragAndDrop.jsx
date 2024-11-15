import React, { useState } from "react";

const membersData = [
  { id: 1, name: "Member 1", info: "" },
  { id: 2, name: "Member 2", info: "" },
  { id: 3, name: "Member 3", info: "" },
];

export default function DragAndDrop() {
  const [members, setMembers] = useState(membersData);
  const [rightBoxMembers, setRightBoxMembers] = useState([]);

  const handleDragStart =
    (member, fromRightBox = false) =>
    (event) => {
      event.dataTransfer.setData("memberId", member.id);
      event.dataTransfer.setData("fromRightBox", fromRightBox);
    };

  const handleDrop = (event, isRightBox) => {
    event.preventDefault();
    const memberId = parseInt(event.dataTransfer.getData("memberId"));
    const fromRightBox = event.dataTransfer.getData("fromRightBox") === "true";

    if (isRightBox && !fromRightBox) {
      // Moving from left to right
      const member = members.find((m) => m.id === memberId);
      const info = prompt(`Enter additional information for ${member.name}`);
      if (info) {
        const updatedMember = { ...member, info };
        setRightBoxMembers((prev) => [...prev, updatedMember]);
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    } else if (!isRightBox && fromRightBox) {
      // Moving from right to left (reset info)
      const member = rightBoxMembers.find((m) => m.id === memberId);
      const resetMember = { ...member, info: "" };
      setMembers((prev) => [...prev, resetMember]);
      setRightBoxMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex gap-8 p-8">
      {/* Left Box */}
      <div
        className="w-1/2 p-4 bg-blue-300 rounded shadow"
        onDrop={(e) => handleDrop(e, false)}
        onDragOver={handleDragOver}
      >
        <h2 className="text-lg font-bold mb-4">Neachitat</h2>
        {members.map((member) => (
          <div
            key={member.id}
            className="p-2 bg-white rounded mb-2 cursor-pointer shadow text-black"
            draggable
            onDragStart={handleDragStart(member)}
          >
            {member.name}
          </div>
        ))}
      </div>

      {/* Right Box */}
      <div
        className="w-1/2 p-4 bg-green-300 rounded shadow"
        onDrop={(e) => handleDrop(e, true)}
        onDragOver={handleDragOver}
      >
        <h2 className="text-lg font-bold mb-4">Achitat</h2>
        {rightBoxMembers.map((member) => (
          <div
            key={member.id}
            className="p-2 bg-white rounded mb-2 cursor-pointer shadow text-black"
            draggable
            onDragStart={handleDragStart(member, true)}
          >
            <p className="font-semibold">{member.name}</p>
            <p className="text-sm text-gray-600">{member.info}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
