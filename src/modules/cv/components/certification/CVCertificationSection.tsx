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
} from '@/modules/cv/hooks/useCertification';
import { CVCertificationList } from './CVCertificationList';
import { CVCertificationForm } from './CVCertificationForm';
import type {
  CVCertificationResponse,
  CreateCVCertificationRequest,
  UpdateCVCertificationRequest,
} from '@/modules/cv/types/cv.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

type CertificationFormValues = {
  name: string;
  organization: string;
  organizationId: string | null;
  issuedDate: Date | null;
  description: string | null;
};

interface CVCertificationSectionProps {
  cvId: string;
  onSuccess?: () => void;
}

export function CVCertificationSection({ cvId, onSuccess }: CVCertificationSectionProps) {
  const { showError, showSuccess } = useNotification();
  const { data: certifications, isLoading: isLoadingCertifications } = useListCertifications({
    cvId,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [editingCertification, setEditingCertification] = useState<CVCertificationResponse | null>(
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
        const updateData: UpdateCVCertificationRequest = {
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
        const createData: CreateCVCertificationRequest = {
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

  const handleEdit = (certification: CVCertificationResponse) => {
    setEditingCertification(certification);
    setIsCreating(false);
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

  const showForm = isCreating || !!editingCertification;

  return (
    <div className="space-y-6">
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
          <CVCertificationList
            certifications={certifications}
            isLoading={isLoadingCertifications}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingCertificationId={deletingCertificationId}
            disabled={showForm || isAnyMutationInProgress}
          />
        </CardContent>
      </Card>

      {showForm && (
        <CVCertificationForm
          editingCertification={editingCertification}
          isLoading={isAnyMutationInProgress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
