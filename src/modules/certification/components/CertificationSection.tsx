import { useState } from 'react';
import { format } from 'date-fns';
import { Award, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useNotification } from '@/shared/hooks/useNotification';
import {
  useListCertifications,
  useCreateCertification,
  useUpdateCertification,
  useDeleteCertification,
} from '@/modules/certification/hooks/useCertification';
import { CertificationList } from './CertificationList';
import { CertificationForm } from './CertificationForm';
import { CertificationView } from './CertificationView';
import { AIEvaluationCard } from '@/modules/cv/components/ai-evaluation';
import { useSectionScore } from '@/modules/cv/hooks/useCVSectionScores';
import { SectionType } from '@/modules/cv/types/ai-evaluation.types';
import type {
  CertificationResponse,
  CreateCertificationRequest,
  UpdateCertificationRequest,
} from '@/modules/certification/types/certification.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

type CertificationFormValues = {
  name: string;
  organization: string;
  organizationId: string | null;
  issuedDate: Date | null;
  description: string | null;
};

interface CertificationSectionProps {
  cvId: string;
  onSuccess?: () => void;
}

export function CertificationSection({ cvId, onSuccess }: CertificationSectionProps) {
  const { showError, showSuccess } = useNotification();
  const { data: certifications, isLoading: isLoadingCertifications } = useListCertifications({
    cvId,
  });
  const { data: sectionScore, isLoading: isLoadingScore } = useSectionScore(cvId, SectionType.Certifications);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCertification, setEditingCertification] = useState<CertificationResponse | null>(
    null
  );
  const [viewingCertification, setViewingCertification] = useState<CertificationResponse | null>(
    null
  );
  const [deletingCertificationId, setDeletingCertificationId] = useState<string | null>(null);

  const createCertification = useCreateCertification({ cvId });
  const updateCertification = useUpdateCertification({ cvId });
  const deleteCertification = useDeleteCertification({ cvId });

  const isAnyMutationInProgress =
    createCertification.isPending || updateCertification.isPending || deleteCertification.isPending;

  const resetForm = () => {
    setIsCreating(false);
    setEditingCertification(null);
  };

  const handleSubmit = async (data: CertificationFormValues) => {
    try {
      if (editingCertification) {
        const updateData: UpdateCertificationRequest = {
          name: data.name,
          organization: data.organization,
          issuedDate: data.issuedDate ? format(data.issuedDate, 'yyyy-MM-dd') : null,
          description: data.description,
        };

        await updateCertification.mutateAsync({
          certificationId: editingCertification.id,
          certificationData: updateData,
        });

        showSuccess('Certification updated successfully');
      } else {
        const createData: CreateCertificationRequest = {
          cvId,
          name: data.name,
          organization: data.organization,
          issuedDate: data.issuedDate ? format(data.issuedDate, 'yyyy-MM-dd') : null,
          description: data.description,
        };

        await createCertification.mutateAsync(createData);
        showSuccess('Certification added successfully');
      }

      resetForm();
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
      throw error;
    }
  };

  const handleEdit = (certification: CertificationResponse) => {
    setEditingCertification(certification);
    setIsCreating(false);
  };

  const handleView = (certification: CertificationResponse) => {
    setViewingCertification(certification);
  };

  const handleDelete = async (certificationId: string) => {
    if (deletingCertificationId === certificationId) return;

    setDeletingCertificationId(certificationId);
    try {
      await deleteCertification.mutateAsync(certificationId);
      showSuccess('Certification deleted successfully');
    } catch (error) {
      const axiosError = error as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
    } finally {
      setDeletingCertificationId(null);
    }
  };

  const handleAddCertification = () => {
    setIsCreating(true);
    setEditingCertification(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleCloseView = () => {
    setViewingCertification(null);
  };

  const showForm = isCreating || !!editingCertification;

  return (
    <div className="space-y-6">
      {/* AI Evaluation Card */}
      <AIEvaluationCard
        sectionScore={sectionScore}
        sectionType={SectionType.Certifications}
        isLoading={isLoadingScore}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
              {isAnyMutationInProgress && (
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2" />
              )}
            </CardTitle>
            <Button
              onClick={handleAddCertification}
              size="sm"
              className="flex items-center gap-2"
              disabled={showForm || isAnyMutationInProgress}
            >
              <Plus className="h-4 w-4" />
              Add Certification
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <CertificationList
            certifications={certifications}
            isLoading={isLoadingCertifications}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            deletingCertificationId={deletingCertificationId}
            disabled={showForm || isAnyMutationInProgress}
          />
        </CardContent>
      </Card>

      {showForm && (
        <CertificationForm
          editingCertification={editingCertification}
          isLoading={isAnyMutationInProgress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {viewingCertification && (
        <CertificationView
          certification={viewingCertification}
          isOpen={!!viewingCertification}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
}
