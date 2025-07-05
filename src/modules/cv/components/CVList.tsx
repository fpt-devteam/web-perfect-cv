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

  const { data, isLoading } = useListCVs({
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

  if (isLoading) {
    return <Skeleton className="h-[200px]" />;
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
        </div>
      )}
    </div>
  );
}
