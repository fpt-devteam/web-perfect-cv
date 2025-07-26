import { format } from 'date-fns';
import { Briefcase, Calendar, Edit3, Trash2, Building, MapPin, Eye } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn.util';
import type { CVExperience } from '@/modules/cv/types/cv.types';

interface CVExperienceCardProps {
  experience: CVExperience;
  onEdit: (experience: CVExperience) => void;
  onDelete: (experienceId: string) => void;
  onView: (experience: CVExperience) => void;
  isDeleting: boolean;
  isDisabled: boolean;
}

export function CVExperienceCard({
  experience,
  onEdit,
  onDelete,
  onView,
  isDeleting,
  isDisabled,
}: CVExperienceCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    return format(new Date(dateString), 'MMM yyyy');
  };

  const getExperienceStatus = (startDate: string, endDate: string) => {
    if (!startDate) return 'Not specified';
    const now = new Date();

    const end = new Date(endDate);

    // If end date is far in the future, consider it current position
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 50);

    if (end > farFuture) return 'Current Position';
    return end > now ? 'Current Position' : 'Completed';
  };

  const handleEdit = () => {
    onEdit(experience);
  };

  const handleDelete = () => {
    if (experience.id) {
      onDelete(experience.id);
    }
  };

  const handleView = () => {
    onView(experience);
  };

  return (
    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              {experience.jobTitle}
            </h3>
          </div>

          <span
            className={cn(
              'text-xs px-2 py-1 rounded-full',
              getExperienceStatus(experience.startDate, experience.endDate) === 'Current Position'
                ? 'bg-green-100 text-green-800'
                : getExperienceStatus(experience.startDate, experience.endDate) === 'Completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
            )}
          >
            {getExperienceStatus(experience.startDate, experience.endDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <Building className="h-3 w-3" />
          <span className="font-medium">{experience.organization || 'No company specified'}</span>
          {experience.employmentTypeName && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {experience.employmentTypeName}
              </span>
            </>
          )}
        </div>

        {experience.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin className="h-3 w-3" />
            <span>{experience.location}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="h-3 w-3" />
          <span>
            {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
          </span>
        </div>

        {experience.description && (
          <div className="text-sm text-gray-600">
            <p className="line-clamp-2">{experience.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 ml-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-green-600"
          onClick={handleView}
          disabled={isDisabled}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
          onClick={handleEdit}
          disabled={isDisabled}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
          onClick={handleDelete}
          disabled={isDisabled || isDeleting}
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
