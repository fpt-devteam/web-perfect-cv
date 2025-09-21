import { useEffect, useState } from 'react';
import { SortOrder } from '@/shared/constants/sort-order.enum';
import { CreateCVCard, CVCard } from '@/modules/cv/components/CVCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Pagination, PaginationInfo } from '@/shared/components/ui/pagination';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useListCVs } from '@/modules/cv/hooks/useListCV';
import { useDebounce } from '@/shared/hooks/useDebounce';

const ITEMS_PER_PAGE = 5;

export function CVList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Descending);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    document.title = 'Resumes';
  }, []);

  // Reset to first page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortOrder]);

  // API query with correct sort format
  const query = {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    'Sort.UpdatedAt': sortOrder,
    searchTerm: debouncedSearchTerm || undefined,
  };

  // Debug logging
  console.log('CV List Query:', query);

  const { data, isLoading, error } = useListCVs(query);

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
      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search CV by ID or title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
          {searchTerm !== debouncedSearchTerm && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={sortOrder} onValueChange={value => setSortOrder(value as SortOrder)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortOrder.Descending}>Latest Updated</SelectItem>
              <SelectItem value={SortOrder.Ascending}>Oldest Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateCVCard />
        {data?.items.length === 0 && debouncedSearchTerm ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs found</h3>
            <p className="text-gray-500">
              No CVs match your search term "{debouncedSearchTerm}". Try a different search term.
            </p>
          </div>
        ) : (
          data?.items.map(cv => <CVCard key={cv.cvId} cv={cv} />)
        )}
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
