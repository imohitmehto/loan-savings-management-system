// components/common/LazySearchSelect.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";

export interface OptionType {
  value: string;
  label: string;
  meta?: unknown;
}

interface LazySearchSelectProps {
  selected: OptionType[];
  onSelect: (option: OptionType) => void;
  onRemove: (option: OptionType) => void;
  onSearch: (
    query: string,
    page: number,
  ) => Promise<{ options: OptionType[]; hasMore: boolean }>;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export default function LazySearchSelect({
  selected,
  onSelect,
  onRemove,
  onSearch,
  placeholder = "Search...",
  label,
  disabled = false,
}: LazySearchSelectProps) {
  const [dropOpen, setDropOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch on open or search/page change
  useEffect(() => {
    if (!dropOpen) return;
    setLoading(true);
    onSearch(search, page).then(({ options: fetched, hasMore }) => {
      setOptions(page === 1 ? fetched : [...options, ...fetched]);
      setHasMore(hasMore);
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [dropOpen, search, page]);

  // Click outside to close
  useEffect(() => {
    if (!dropOpen) return;
    function handle(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [dropOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={
          `flex flex-wrap items-center min-h-[44px] border rounded-md bg-gray-50 px-2 py-2 cursor-pointer` +
          (dropOpen
            ? " border-blue-400 ring-2 ring-blue-200"
            : " border-gray-300")
        }
        onClick={() => {
          if (!disabled) setDropOpen((v) => !v);
        }}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={dropOpen}
      >
        {selected.length === 0 ? (
          <span className="text-gray-400 ml-1">{placeholder}</span>
        ) : (
          selected.map((o) => (
            <span
              key={o.value}
              className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-1 text-sm"
            >
              {o.label}
              <button
                disabled={disabled}
                type="button"
                className="ml-1 text-lg text-blue-400 hover:text-red-500 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(o);
                }}
                aria-label={`Remove ${o.label}`}
                tabIndex={-1}
              >
                ×
              </button>
            </span>
          ))
        )}
        <span className="flex-1" />
        <span className="text-gray-400 pr-2">&#9662;</span>
      </div>
      {dropOpen && (
        <div className="absolute z-20 mt-1 left-0 w-full max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg animate-fade-in">
          <input
            autoFocus
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border-b border-gray-200 outline-none"
            autoComplete="off"
            disabled={disabled}
          />
          <div>
            {options.length === 0 && !loading && (
              <div className="p-4 text-gray-400 text-center">
                No matching items.
              </div>
            )}
            {options.map((o) => (
              <button
                disabled={disabled}
                type="button"
                key={o.value}
                className="flex w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-100 transition"
                onClick={() => {
                  onSelect(o);
                  setSearch("");
                  setPage(1);
                }}
              >
                {o.label}
              </button>
            ))}
            {loading && (
              <div className="p-2 text-center text-blue-400">Loading...</div>
            )}
            {!loading && hasMore && (
              <button
                onClick={() => setPage(page + 1)}
                className="w-full text-blue-600 py-2 font-medium text-sm bg-blue-50 hover:bg-blue-100"
              >
                Load more...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
