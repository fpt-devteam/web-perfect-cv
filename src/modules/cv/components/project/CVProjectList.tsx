import { FileText } from 'lucide-react';
import { CVProjectCard } from './CVProjectCard';
import type { CVProjectResponse } from '@/modules/cv/types/cv.types';

interface CVProjectListProps {
  projects: CVProjectResponse[] | undefined;
  isLoading: boolean;
  onEdit: (project: CVProjectResponse) => void;
  onDelete: (projectId: string) => void;
  deletingProjectId: string | null;
  disabled?: boolean;
}

export function CVProjectList({
  projects,
  isLoading,
  onEdit,
  onDelete,
  deletingProjectId,
  disabled = false,
}: CVProjectListProps) {
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

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm">No projects added yet</p>
        <p className="text-xs text-gray-400 mt-1">Add your projects to showcase your experience</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map(project => (
        <CVProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingProjectId === project.id}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
