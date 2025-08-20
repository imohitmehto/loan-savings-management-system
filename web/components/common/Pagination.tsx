"use client";

/**
 * Props for the Pagination component
 */
interface PaginationProps {
  /** Total number of pages */
  totalPages: number;

  /** Current active page (1-based index) */
  currentPage: number;

  /** Callback when a page changes */
  onPageChange: (page: number) => void;

  /** Optional: Max visible page numbers before showing ellipsis */
  maxVisiblePages?: number;
}

/**
 * A reusable, accessible, and responsive pagination component
 *
 * - Supports Prev/Next navigation
 * - Displays ellipsis for large number of pages
 */
export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  // ==== VALIDATIONS ====
  if (totalPages < 1) return null;
  if (currentPage > totalPages) {
    console.error("Pagination: currentPage exceeds totalPages");
    return null;
  }
  if (currentPage < 1) {
    console.error("Pagination: currentPage must be at least 1");
    return null;
  }

  /**
   * Generates an array of page numbers with ellipsis
   * Example: [1, 2, 3, "...", 10]
   */
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    // Show all pages if total small
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // ==== HANDLERS ====
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className="flex justify-center items-center mt-6 flex-wrap gap-2"
      aria-label="Pagination"
    >
      {/* Prev Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 
                   disabled:opacity-50 hover:bg-gray-300 
                   disabled:hover:bg-gray-200 transition"
        aria-label="Previous page"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`px-3 py-1 rounded transition min-w-[32px] text-center focus:outline-none 
              focus:ring-2 focus:ring-blue-500
              ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 
                   disabled:opacity-50 hover:bg-gray-300 
                   disabled:hover:bg-gray-200 transition"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
