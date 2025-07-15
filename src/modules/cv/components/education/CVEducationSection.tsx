import { useState } from 'react';
import { format } from 'date-fns';
import { GraduationCap, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useNotification } from '@/shared/hooks/useNotification';
import {
  useListEducations,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '@/modules/cv/hooks/useEducation';
import { useGetDegree } from '@/modules/cv/hooks/useGetDegree';
import { CVEducationList } from './CVEducationList';
import { CVEducationForm as EducationFormComponent } from './CVEducationForm';
import type {
  CVEducationResponse,
  CreateCVEducationRequest,
  UpdateCVEducationRequest,
} from '@/modules/cv/types/cv.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

type EducationFormValues = {
  degree: string;
  organization: string;
  location?: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};

interface CVEducationSectionProps {
  cvId: string;
  onSuccess?: () => void;
}

export function CVEducationSection({ cvId }: { readonly cvId: string }) {
  return <CVEducationForm cvId={cvId} />;
}

function CVEducationForm({ cvId, onSuccess }: CVEducationSectionProps) {
  const { showError, showSuccess } = useNotification();
  const { data: educations, isLoading: isLoadingEducations } = useListEducations({ cvId });
  const { data: degrees } = useGetDegree();
  const [isCreating, setIsCreating] = useState(false);
  const [editingEducation, setEditingEducation] = useState<CVEducationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingEducationId, setDeletingEducationId] = useState<string | null>(null);

  const createEducation = useCreateEducation({ cvId });
  const updateEducation = useUpdateEducation({ cvId });
  const deleteEducation = useDeleteEducation({ cvId });

  const isAnyMutationInProgress =
    createEducation.isPending || updateEducation.isPending || deleteEducation.isPending;

  const handleAddEducation = () => {
    setIsCreating(true);
    setEditingEducation(null);
  };

  const handleEdit = (education: CVEducationResponse) => {
    // Add defensive check for undefined education object
    if (!education) {
      showError('Education object is missing. Cannot edit education.');
      return;
    }

    // Add debugging to see the full education object structure
    console.log('Full education object:', JSON.stringify(education, null, 2));
    console.log('Education id:', education.id);
    console.log('Education type:', typeof education.id);

    setEditingEducation(education);
    setIsCreating(false);
  };

  const handleDelete = async (educationId: string) => {
    // Add defensive check for undefined id
    if (!educationId) {
      showError('Education ID is missing. Cannot delete education.');
      return;
    }

    if (deletingEducationId === educationId) return;
    setDeletingEducationId(educationId);

    try {
      await deleteEducation.mutateAsync(educationId);
      showSuccess('Education deleted successfully');
    } catch (error) {
      const axiosError = error as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
    } finally {
      setDeletingEducationId(null);
    }
  };

  const handleSubmit = async (data: EducationFormValues) => {
    setIsLoading(true);
    try {
      if (editingEducation) {
        // Add defensive check for undefined id
        if (!editingEducation.id) {
          showError('Education ID is missing. Please try again.');
          return;
        }

        const updateData: UpdateCVEducationRequest = {
          id: editingEducation.id,
          degree: data.degree,
          organization: data.organization,
          location: data.location || null,
          fieldOfStudy: data.fieldOfStudy || '', // Convert null to empty string for required field
          startDate: data.startDate ? format(new Date(data.startDate), 'yyyy-MM-dd') : '',
          endDate: data.endDate ? format(new Date(data.endDate), 'yyyy-MM-dd') : '',
          description: data.description,
          gpa: data.gpa,
        };

        await updateEducation.mutateAsync({
          educationId: editingEducation.id,
          educationData: updateData,
        });
        showSuccess('Education updated successfully');
      } else {
        const createData: CreateCVEducationRequest = {
          cvId,
          degree: data.degree,
          organization: data.organization,
          fieldOfStudy: data.fieldOfStudy,
          startDate: data.startDate ? format(new Date(data.startDate), 'yyyy-MM-dd') : null,
          endDate: data.endDate ? format(new Date(data.endDate), 'yyyy-MM-dd') : null,
          description: data.description,
          gpa: data.gpa,
        };

        await createEducation.mutateAsync(createData);
        showSuccess('Education added successfully');
      }

      handleCancel();
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingEducation(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
              {isAnyMutationInProgress && (
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2" />
              )}
            </CardTitle>
            <Button
              onClick={handleAddEducation}
              size="sm"
              className="flex items-center gap-2"
              disabled={isCreating || !!editingEducation || isAnyMutationInProgress}
            >
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CVEducationList
            educations={educations || []}
            isLoading={isLoadingEducations}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingEducationId={deletingEducationId}
            isDisabled={isCreating || !!editingEducation || isAnyMutationInProgress}
          />
        </CardContent>
      </Card>

      {(isCreating || editingEducation) && (
        <Card>
          <CardContent className="pt-6">
            <EducationFormComponent
              editingEducation={editingEducation}
              degrees={degrees}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
