"use client";
import React from "react";

interface GenericTableProps<T> {
  columns: { label: string; className?: string }[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

export default function GenericTable<T>({
  columns,
  data,
  renderRow,
}: GenericTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`text-left text-gray-600 font-semibold py-3 px-4 text-xs sm:text-sm tracking-wide ${
                  col.className || ""
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>
      </table>
    </div>
  );
}
