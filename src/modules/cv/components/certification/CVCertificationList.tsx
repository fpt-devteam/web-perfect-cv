import { Award } from 'lucide-react';
import { CVCertificationCard } from './CVCertificationCard';
import type { CVCertificationResponse } from '@/modules/cv/types/cv.types';

interface CVCertificationListProps {
  certifications: CVCertificationResponse[] | undefined;
  isLoading: boolean;
  onEdit: (certification: CVCertificationResponse) => void;
  onDelete: (certificationId: string) => void;
  deletingCertificationId: string | null;
  disabled?: boolean;
}

export function CVCertificationList({
  certifications,
  isLoading,
  onEdit,
  onDelete,
  deletingCertificationId,
  disabled = false,
}: CVCertificationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!certifications || certifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm">No certifications added yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Add your professional certifications to showcase your expertise
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {certifications.map(certification => (
        <CVCertificationCard
          key={certification.id}
          certification={certification}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingCertificationId === certification.id}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
