"use client";
import React from "react";

// Example report data
const reportData = [
  {
    name: "Loan Applications",
    total: 120,
    approved: 76,
    rejected: 24,
    pending: 20,
  },
  { name: "Savings Accounts", total: 300, active: 260, dormant: 40 },
];

export default function SimpleReportPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-4">Monthly Financial Summary</h1>
      {/* <p className="mb-6 text-gray-700">
        This report gives a quick overview of recent loan and savings account
        activity for August 2025.
      </p>
      <table className="min-w-full table-auto border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Approved/Active</th>
            <th className="px-4 py-2 border">Rejected/Dormant</th>
            <th className="px-4 py-2 border">Pending</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{reportData[0].name}</td>
            <td className="border px-4 py-2">{reportData.total}</td>
            <td className="border px-4 py-2">{reportData.approved}</td>
            <td className="border px-4 py-2">{reportData.rejected}</td>
            <td className="border px-4 py-2">{reportData.pending}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">{reportData[1].name}</td>
            <td className="border px-4 py-2">{reportData[1].total}</td>
            <td className="border px-4 py-2">{reportData[1].active}</td>
            <td className="border px-4 py-2">{reportData[1].dormant}</td>
            <td className="border px-4 py-2">—</td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
}
