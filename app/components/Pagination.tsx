import React from 'react';
import { Button } from '@/app/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = React.memo(({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="w-full md:w-auto"
      >
        이전
      </Button>
      <span className="px-4 py-2 text-gray-600">
        {currentPage} / {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="w-full md:w-auto"
      >
        다음
      </Button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination; 