import { format } from 'date-fns';
import { FileText, Calendar, Link as LinkIcon, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { CVProjectResponse } from '@/modules/cv/types/cv.types';

interface CVProjectCardProps {
  project: CVProjectResponse;
  onEdit: (project: CVProjectResponse) => void;
  onDelete: (projectId: string) => void;
  isDeleting?: boolean;
  disabled?: boolean;
}

export function CVProjectCard({
  project,
  onEdit,
  onDelete,
  isDeleting = false,
  disabled = false,
}: CVProjectCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    return format(new Date(dateString), 'MMM yyyy');
  };

  const handleEdit = () => {
    onEdit(project);
  };

  const handleDelete = () => {
    if (project.id) {
      onDelete(project.id);
    }
  };

  return (
    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              {project.title}
            </h3>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline flex items-center"
              >
                <LinkIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          {project.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(project.startDate)}
            </span>
          )}
          {project.endDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(project.endDate)}
            </span>
          )}
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{project.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          disabled={isDeleting || disabled}
        >
          {isDeleting ? (
            <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
