import React, { useState, useEffect } from "react";
import axios from "axios";

function MemberTable() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.get("/api/members").then((response) => setMembers(response.data));
  }, []);

  const toggleStatus = (id) => {
    axios.post(`/api/members/${id}/toggle`).then((response) => {
      setMembers(
        members.map((member) =>
          member.id === id ? { ...member, status: !member.status } : member
        )
      );
    });
  };

  const resetStatuses = () => {
    axios.post("/api/members/reset").then(() => {
      setMembers(members.map((member) => ({ ...member, status: false })));
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Discord Members</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-blue-200">Username</th>
            <th className="py-2 px-4 bg-blue-200">Status</th>
            <th className="py-2 px-4 bg-blue-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td className="py-2 px-4 border">{member.username}</td>
              <td
                className={`py-2 px-4 border ${
                  member.status ? "text-green-600" : "text-red-600"
                }`}
              >
                {member.status ? "Ready" : "Inactive"}
              </td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => toggleStatus(member.id)}
                  className="px-4 py-1 bg-blue-500 text-white rounded"
                >
                  {member.status ? "Mark Inactive" : "Mark Ready"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={resetStatuses}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Reset Statuses
      </button>
    </div>
  );
}

export default MemberTable;
