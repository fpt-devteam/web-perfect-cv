import { format } from 'date-fns';
import { Briefcase, Calendar, Building, MapPin, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/utils/cn.util';
import type { CVExperience } from '@/modules/experience/types/experience.types';

interface CVExperienceViewProps {
  experience: CVExperience;
  isOpen: boolean;
  onClose: () => void;
}

export function CVExperienceView({ experience, isOpen, onClose }: CVExperienceViewProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    return format(new Date(dateString), 'MMMM yyyy');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Experience Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">{experience.jobTitle}</h2>
              <span
                className={cn(
                  'text-xs px-3 py-1 rounded-full font-medium',
                  getExperienceStatus(experience.startDate, experience.endDate) ===
                    'Current Position'
                    ? 'bg-green-100 text-green-800'
                    : getExperienceStatus(experience.startDate, experience.endDate) === 'Completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                )}
              >
                {getExperienceStatus(experience.startDate, experience.endDate)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-lg text-gray-700 mb-2">
              <Building className="h-4 w-4" />
              <span className="font-medium">
                {experience.organization || 'No company specified'}
              </span>
            </div>

            {experience.employmentTypeName && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {experience.employmentTypeName}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            {experience.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Location</h4>
                  <p className="text-sm text-gray-600">{experience.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Duration</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                </p>
              </div>
            </div>

            {experience.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {experience.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
