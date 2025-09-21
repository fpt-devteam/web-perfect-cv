import { format } from 'date-fns';
import { GraduationCap, Calendar, Building, MapPin, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { cn } from '@/shared/utils/cn.util';
import type { EducationResponse } from '@/modules/education/types/education.types';

interface EducationViewProps {
  education: EducationResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function EducationView({ education, isOpen, onClose }: EducationViewProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    return format(new Date(dateString), 'MMMM yyyy');
  };

  const getEducationStatus = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return 'Not specified';
    if (!endDate) return 'In Progress';
    return 'Completed';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Education Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">{education.degree}</h2>
              <span
                className={cn(
                  'text-xs px-3 py-1 rounded-full font-medium',
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

            <div className="flex items-center gap-2 text-lg text-gray-700 mb-2">
              <Building className="h-4 w-4" />
              <span className="font-medium">{education.organization}</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {education.fieldOfStudy && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Field of Study</h4>
                <p className="text-sm text-gray-600">{education.fieldOfStudy}</p>
              </div>
            )}

            {education.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Location</h4>
                  <p className="text-sm text-gray-600">{education.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Duration</h4>
                <p className="text-sm text-gray-600">
                  {education.startDate && formatDate(education.startDate)}
                  {education.startDate && education.endDate && ' - '}
                  {education.endDate && formatDate(education.endDate)}
                  {!education.startDate && !education.endDate && 'Not specified'}
                </p>
              </div>
            </div>

            {education.gpa && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">GPA</h4>
                <p className="text-sm text-gray-600">{education.gpa.toFixed(2)}</p>
              </div>
            )}

            {education.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {education.description}
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