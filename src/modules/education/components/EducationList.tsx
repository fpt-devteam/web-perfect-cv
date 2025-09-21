import { GraduationCap } from 'lucide-react';
import { EducationCard } from './EducationCard';
import type { EducationResponse } from '@/modules/education/types/education.types';

interface EducationListProps {
  educations: EducationResponse[];
  isLoading: boolean;
  onEdit: (education: EducationResponse) => void;
  onDelete: (educationId: string) => void;
  onView: (education: EducationResponse) => void;
  deletingEducationId: string | null;
  isDisabled: boolean;
}

export function EducationList({
  educations,
  isLoading,
  onEdit,
  onDelete,
  onView,
  deletingEducationId,
  isDisabled,
}: EducationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!educations || educations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm">No education added yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Add your educational background to showcase your qualifications
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educations.map(education => (
        <EducationCard
          key={education.id}
          education={education}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          isDeleting={deletingEducationId === education.id}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
}