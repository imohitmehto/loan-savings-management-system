'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';

interface GenericListProps<T> {
  fetchData: () => Promise<T[]>;
  renderList: (items: T[]) => React.ReactNode;
  filterFunction?: (item: T, filterText: string) => boolean;
  entriesPerPage?: number;
  filterText?: string;
  setFilterText?: (text: string) => void;
}

export default function GenericList<T>({
  fetchData,
  renderList,
  filterFunction,
  entriesPerPage = 8,
  filterText: controlledFilterText,
  setFilterText: setControlledFilterText,
}: GenericListProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Internal filter state if no controlled props provided
  const [internalFilterText, setInternalFilterText] = useState('');
  const filterText =
    controlledFilterText !== undefined
      ? controlledFilterText
      : internalFilterText;
  const setFilterText = setControlledFilterText || setInternalFilterText;

  const [currentPage, setCurrentPage] = useState(1);

  // Load data
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData();

        if (!Array.isArray(result)) {
          throw new Error('Unexpected data format received from API');
        }

        if (isMounted) {
          setData(result);
          setFilteredData(result);
        }
      } catch (err) {
        console.error('GenericList fetch error:', err);
        if (isMounted) {
          setError('Unable to load data right now. Please try again later.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  // Filtering logic
  useEffect(() => {
    if (!filterText.trim()) {
      setFilteredData(data);
      setCurrentPage(1);
      return;
    }

    if (filterFunction) {
      setFilteredData(data.filter(item => filterFunction(item, filterText)));
    } else {
      setFilteredData(data);
    }
    setCurrentPage(1);
  }, [filterText, data, filterFunction]);

  // Pagination
  const lastIndex = currentPage * entriesPerPage;
  const firstIndex = lastIndex - entriesPerPage;
  const currentItems = useMemo(
    () => filteredData.slice(firstIndex, lastIndex),
    [filteredData, firstIndex, lastIndex]
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Filter input handlers
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterText(e.target.value);
    },
    [setFilterText]
  );

  const clearFilter = useCallback(() => {
    setFilterText('');
  }, [setFilterText]);

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-red-600 p-6 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && <EmptyState />}

      {/* Content */}
      {!loading && !error && data.length > 0 && (
        <>
          {/* Filter */}
          {filterFunction && (
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
              <input
                type="text"
                placeholder="Search..."
                value={filterText}
                onChange={handleFilterChange}
                className="w-full sm:max-w-md px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-label="Filter list"
              />
              {filterText && (
                <button
                  onClick={clearFilter}
                  className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition self-start sm:self-auto"
                  aria-label="Clear filter"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Render List Items */}
          {renderList(currentItems)}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              maxVisiblePages={8}
            />
          )}
        </>
      )}
    </div>
  );
}
