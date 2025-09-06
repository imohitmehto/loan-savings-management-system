"use client";

import React from "react";

interface FundAllocation {
  name: string;
  value: number;
}

interface FundAllocationTableProps {
  data: FundAllocation[];
}

export default function FundAllocationTable({
  data,
}: FundAllocationTableProps) {
  // Calculate the total value
  const total = data.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div className="overflow-auto rounded-lg border border-gray-300 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Fund
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Value
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map(({ name, value }, idx) => (
            <tr key={idx} className="hover:bg-gray-100">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                {name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-700">
                {value.toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-700">
                {((value / total) * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-bold">
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
              Total
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-900">
              {total.toLocaleString()}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-900">
              100%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
