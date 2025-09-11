import React from 'react';

interface GenericTableRowProps {
  index: number;
  cells: React.ReactNode[];
  cellClasses?: string[];
  onClick?: () => void;
}

export default function GenericTableRow({
  index,
  cells,
  cellClasses = [],
  onClick,
}: GenericTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      } hover:bg-blue-50 cursor-default transition-colors duration-150`}
    >
      {cells.map((cell, i) => (
        <td
          key={i}
          className={cellClasses[i] || 'py-2 px-4 text-sm text-gray-700'}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}
