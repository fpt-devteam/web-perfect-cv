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
} from '@/modules/education/hooks/useEducation';
import { useGetDegree } from '@/modules/education/hooks/useGetDegree';
import { EducationList } from './EducationList';
import { EducationForm as EducationFormComponent } from './EducationForm';
import { EducationView } from './EducationView';
import type {
  EducationResponse,
  CreateEducationRequest,
  UpdateEducationRequest,
  EducationFormValues,
} from '@/modules/education/types/education.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

interface EducationSectionProps {
  cvId: string;
  onSuccess?: () => void;
}

export function EducationSection({ cvId }: { readonly cvId: string }) {
  return <EducationManager cvId={cvId} />;
}

function EducationManager({ cvId, onSuccess }: EducationSectionProps) {
  const { showError, showSuccess } = useNotification();
  const { data: educations, isLoading: isLoadingEducations } = useListEducations({ cvId });
  const { data: degrees } = useGetDegree();
  const [isCreating, setIsCreating] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationResponse | null>(null);
  const [viewingEducation, setViewingEducation] = useState<EducationResponse | null>(null);
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

  const handleEdit = (education: EducationResponse) => {
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

  const handleView = (education: EducationResponse) => {
    if (!education) {
      showError('Education object is missing. Cannot view education.');
      return;
    }

    setViewingEducation(education);
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

        const updateData: UpdateEducationRequest = {
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
        const createData: CreateEducationRequest = {
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

  const handleCloseView = () => {
    setViewingEducation(null);
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
          <EducationList
            educations={educations || []}
            isLoading={isLoadingEducations}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
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

      {viewingEducation && (
        <EducationView
          education={viewingEducation}
          isOpen={!!viewingEducation}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
}