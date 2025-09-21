import { format } from 'date-fns';
import { FileText, Calendar, Link as LinkIcon, Edit3, Trash2, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { ProjectResponse } from '@/modules/project/types/project.types';

interface ProjectCardProps {
  project: ProjectResponse;
  onEdit: (project: ProjectResponse) => void;
  onDelete: (projectId: string) => void;
  onView: (project: ProjectResponse) => void;
  isDeleting?: boolean;
  disabled?: boolean;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onView,
  isDeleting = false,
  disabled = false,
}: ProjectCardProps) {
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

  const handleView = () => {
    onView(project);
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

      <div className="flex items-center gap-1 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          className="h-8 w-8 p-0 text-gray-400 hover:text-green-600"
          disabled={disabled}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
          disabled={disabled}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
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