import { format } from 'date-fns';
import { GraduationCap, Calendar, Edit3, Trash2, Building, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn.util';
import type { EducationResponse } from '@/modules/education/types/education.types';

interface EducationCardProps {
  education: EducationResponse;
  onEdit: (education: EducationResponse) => void;
  onDelete: (educationId: string) => void;
  onView: (education: EducationResponse) => void;
  isDeleting: boolean;
  isDisabled: boolean;
}

export function EducationCard({
  education,
  onEdit,
  onDelete,
  onView,
  isDeleting,
  isDisabled,
}: EducationCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    return format(new Date(dateString), 'MMM yyyy');
  };

  const getEducationStatus = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return 'Not specified';
    if (!endDate) return 'In Progress';
    return 'Completed';
  };

  const handleEdit = () => {
    onEdit(education);
  };

  const handleDelete = () => {
    if (education.id) {
      onDelete(education.id);
    }
  };

  const handleView = () => {
    onView(education);
  };

  return (
    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              {education.degree}
            </h3>
          </div>

          <span
            className={cn(
              'text-xs px-2 py-1 rounded-full',
              getEducationStatus(education.startDate, education.endDate) === 'In Progress'
                ? 'bg-blue-100 text-blue-800'
                : getEducationStatus(education.startDate, education.endDate) === 'Completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
            )}
          >
            {getEducationStatus(education.startDate, education.endDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <Building className="h-3 w-3" />
          <span className="font-medium">{education.organization}</span>
        </div>

        {education.fieldOfStudy && (
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Field of Study:</span> {education.fieldOfStudy}
          </div>
        )}

        {education.location && (
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Location:</span> {education.location}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          {education.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(education.startDate)}
            </span>
          )}
          {education.endDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(education.endDate)}
            </span>
          )}
        </div>

        {education.gpa && (
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">GPA:</span> {education.gpa.toFixed(2)}
          </div>
        )}

        {education.description && (
          <div className="text-sm text-gray-600 mt-2">
            <p className="line-clamp-2">{education.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          className="h-8 w-8 p-0 text-gray-400 hover:text-green-600"
          disabled={isDisabled}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
          disabled={isDisabled}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
          disabled={isDeleting || isDisabled}
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