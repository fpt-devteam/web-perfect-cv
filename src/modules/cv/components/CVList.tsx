import { useEffect, useState } from 'react';
import { SortOrder } from '@/shared/constants/sort-order.enum';
import { CreateCVCard, CVCard } from '@/modules/cv/components/CVCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Pagination, PaginationInfo } from '@/shared/components/ui/pagination';
import { useListCVs } from '@/modules/cv/hooks/useListCV';

const ITEMS_PER_PAGE = 5;

export function CVList() {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Resumes';
  }, []);

  const { data, isLoading, error } = useListCVs({
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    sort: {
      updatedAt: SortOrder.Descending,
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show loading skeleton for initial load
  if (isLoading && !data) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateCVCard />
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-[280px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading CVs</h3>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateCVCard />
        {data?.items.map(cv => <CVCard key={cv.cvId} cv={cv} />)}
      </div>

      {/* Pagination Controls */}
      {data && data.total > ITEMS_PER_PAGE && (
        <div className="mt-8 flex flex-col items-center space-y-4">
          <PaginationInfo
            currentPage={currentPage}
            totalItems={data.total}
            itemsPerPage={ITEMS_PER_PAGE}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          {/* Show loading indicator when changing pages */}
          {isLoading && (
            <div className="flex items-center justify-center mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-gray-500">Loading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
