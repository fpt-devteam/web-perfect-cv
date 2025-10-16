import { format } from 'date-fns';
import { Award, Calendar, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import type { CertificationResponse } from '@/modules/certification/types/certification.types';

interface CertificationViewProps {
  certification: CertificationResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificationView({ certification, isOpen, onClose }: CertificationViewProps) {
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
              <Award className="h-5 w-5 text-blue-600" />
              Certification Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{certification.name}</h2>
            <div className="flex items-center gap-2 text-lg text-gray-700">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{certification.organization}</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Issued Date</h4>
                <p className="text-sm text-gray-600">{formatDate(certification.issuedDate)}</p>
              </div>
            </div>

            {certification.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {certification.description}
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
