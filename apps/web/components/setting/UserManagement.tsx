"use client";

import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User";
}

const mockUsers: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User" },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Just placeholder functions
  const handleRoleToggle = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === id ? { ...u, role: u.role === "Admin" ? "User" : "Admin" } : u
      )
    );
  };

  return (
    <section className="p-6">
      <h3 className="text-2xl font-semibold mb-4">User Management</h3>
      <table className="w-full table-fixed border-collapse border border-slate-700 text-left text-slate-200">
        <thead>
          <tr className="bg-slate-800">
            <th className="border border-slate-600 p-2 w-1/3">Name</th>
            <th className="border border-slate-600 p-2 w-1/3">Email</th>
            <th className="border border-slate-600 p-2 w-1/6">Role</th>
            <th className="border border-slate-600 p-2 w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, email, role }) => (
            <tr key={id} className="hover:bg-slate-700 transition-colors">
              <td className="border border-slate-700 p-2">{name}</td>
              <td className="border border-slate-700 p-2">{email}</td>
              <td className="border border-slate-700 p-2">{role}</td>
              <td className="border border-slate-700 p-2">
                <button
                  onClick={() => handleRoleToggle(id)}
                  className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Toggle Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
