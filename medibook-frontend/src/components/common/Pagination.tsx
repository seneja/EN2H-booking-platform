import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      <div className="pagination__pages">
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination__page ${p === page ? 'pagination__page--active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
