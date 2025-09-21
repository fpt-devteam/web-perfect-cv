import { format } from 'date-fns';
import { FileText, Calendar, X, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import type { ProjectResponse } from '@/modules/project/types/project.types';

interface ProjectViewProps {
  project: ProjectResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectView({ project, isOpen, onClose }: ProjectViewProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    return format(new Date(dateString), 'MMMM yyyy');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Project Details
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">View Project</span>
                </a>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Duration</h4>
                <p className="text-sm text-gray-600">
                  {project.startDate && formatDate(project.startDate)}
                  {project.startDate && project.endDate && ' - '}
                  {project.endDate && formatDate(project.endDate)}
                  {!project.startDate && !project.endDate && 'Not specified'}
                </p>
              </div>
            </div>

            {project.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}