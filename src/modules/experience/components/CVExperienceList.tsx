import { Briefcase } from 'lucide-react';
import { CVExperienceCard } from './CVExperienceCard';
import type { CVExperience } from '@/modules/experience/types/experience.types';

interface CVExperienceListProps {
  experiences: CVExperience[];
  isLoading: boolean;
  onEdit: (experience: CVExperience) => void;
  onDelete: (experienceId: string) => void;
  onView: (experience: CVExperience) => void;
  deletingExperienceId: string | null;
  isDisabled: boolean;
}

export function CVExperienceList({
  experiences,
  isLoading,
  onEdit,
  onDelete,
  onView,
  deletingExperienceId,
  isDisabled,
}: CVExperienceListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-48"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm">No work experience added yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Add your professional experience to showcase your career journey
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map(experience => (
        <CVExperienceCard
          key={experience.id}
          experience={experience}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          isDeleting={deletingExperienceId === experience.id}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
}
