import { getAllCvByUserId } from '@/modules/cv/services/cv.services';
import type { CV } from '@/modules/cv/types/cv.types';
import { CreateCard, CvPreview } from '@/shared/components/cv/thumbnail';
import { useGetMe } from '@/shared/hooks/useGetMe';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_private/_user/cvs/')({
  component: CVDashboard,
})

export function CVDashboard() {
  const [cvList, setCvList] = useState<CV[]>([]);

  const { mutate, isPending, user } = useGetMe();

  useEffect(() => {
    if (!user) {
      mutate();
    }
  }, [user, mutate]);

  useEffect(() => {
    document.title = 'CV Dashboard';
  }, []);

  useEffect(() => {

    async function fetchData() {
      if (!user) return;
      const res = await getAllCvByUserId(user.id!);
      console.log(res);
      setCvList(res);
    }

    fetchData();
  }, [user]);

  if (isPending || !user) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <CreateCard />
        {cvList.map((cv) => (
          <CvPreview file={cv.url} key={cv.cvId} cvId={cv.cvId} />
        ))}
      </div>

      {cvList.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No resumes found.</p>
      )}
    </>
  );
}

