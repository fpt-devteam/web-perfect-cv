import { useEffect } from 'react';
import { SortOrder } from '@/shared/constants/sort-order.enum';
import { CreateCVCard, CVCard } from '@/modules/cv/components/CVCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useListCVs } from '@/modules/cv/hooks/useListCV';

export function CVList() {
  useEffect(() => {
    document.title = 'Resumes';
  }, []);

  const { data, isLoading } = useListCVs({
    limit: 5,
    offset: 0,
    sort: {
      updatedAt: SortOrder.Descending,
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[200px]" />;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateCVCard />
        {data?.items.map(cv => <CVCard key={cv.cvId} cv={cv} />)}
      </div>
    </div>
  );
}
