import { getAllCvByUserId } from '@/modules/cv/services/cv.services';
import type { CV } from '@/modules/cv/types/cv.types';
import { createFileRoute, Link } from '@tanstack/react-router'
import { MoreVertical, Plus } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_private/_user/cvs/')({
  component: CVDashboard,
})

function CVDashboard() {
  const [cvList, setCvList] = useState<CV[]>([]);

  useEffect(() => {
    document.title = 'CV Dashboard';
    async function fetchData() {
      const res = await getAllCvByUserId("1");
      setCvList(res);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <CreateCard />
        {cvList.map((cv) => (
          <CvCard key={cv.cvId} cv={cv} />
        ))}
      </div>

      {cvList.length === 0 && (
        <p className='text-sm text-gray-500 mt-4'>No resumes found.</p>
      )}
    </>
  );
}

function CreateCard() {
  return (
    <Link
      to='/cvs/create'
      className='flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg min-h-[250px] hover:border-blue-600 transition-colors'
    >
      <Plus className='text-gray-400 w-10 h-10' />
      <span className='text-gray-500 mt-2'>Create new resume</span>
    </Link>
  );
}

function CvCard({ cv }: { cv: CV }) {
  return (
    <Link
      to="/cvs/$cvId"
      params={{ cvId: cv.cvId }}
      className='relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow'
    >
      <div className='h-[210px] bg-gray-50 flex items-center justify-center text-xs text-gray-400'>
        Resume preview
      </div>
      <div className='p-3'>
        <h3 className='font-medium text-sm truncate'>{cv.title}</h3>
        {/* <p className='text-xs text-gray-500'>
          Edited {formatDistanceToNow(new Date(cv.createdAt), { addSuffix: true })}
        </p> */}
      </div>
      <MoreVertical className='absolute top-2 right-2 text-gray-400 w-4 h-4' />
    </Link>
  );
}