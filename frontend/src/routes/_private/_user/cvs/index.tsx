import { getAllCvByUserId } from '@/modules/cv/services/cv.services';
import type { CV } from '@/modules/cv/types/cv.types';
import { CvPreview } from '@/shared/components/cv/thumbnail';
import { SpinnerPage } from '@/shared/components/spinnerPage/SpinnerPage';
import { useGetMe } from '@/shared/hooks/useGetMe';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react';
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
    return <SpinnerPage />;
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

export function CreateCard() {
  return (
    <Link
      to='/cvs/create'
      className="
        flex flex-col items-center justify-center
        border border-gray-300
        rounded-lg
        overflow-hidden
        bg-white
        shadow
        hover:shadow-lg
        transition duration-200 ease-in-out transform hover:scale-[1.02]
        w-[200px]
        h-[300px]
      "
    >
      <Plus className="text-gray-400 w-10 h-10" />
      <span className="text-gray-500 mt-2">Create new resume</span>
    </Link>
  );
}