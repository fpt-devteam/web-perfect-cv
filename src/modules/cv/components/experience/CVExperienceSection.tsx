import { useState } from 'react';
import { format } from 'date-fns';
import { Briefcase, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useNotification } from '@/shared/hooks/useNotification';
import {
  useListExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '@/modules/cv/hooks/useExperiences';
import { CVExperienceList } from './CVExperienceList';
import { CVExperienceForm } from './CVExperienceForm';
import type { CVExperience } from '@/modules/cv/types/cv.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

type ExperienceFormValues = {
  jobTitle: string;
  jobTitleId: string | null;
  employmentTypeId: string;
  organization: string;
  organizationId: string | null;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
};

interface CVExperienceSectionProps {
  cvId: string;
  onSuccess?: () => void;
}

function ExperienceSection({ cvId }: { readonly cvId: string }) {
  return <CVExperienceSection cvId={cvId} />;
}

function CVExperienceSection({ cvId, onSuccess }: CVExperienceSectionProps) {
  const { showError, showSuccess } = useNotification();
  const { data: experiences, isLoading: isLoadingExperiences } = useListExperiences({ cvId });
  const [isCreating, setIsCreating] = useState(false);
  const [editingExperience, setEditingExperience] = useState<CVExperience | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingExperienceId, setDeletingExperienceId] = useState<string | null>(null);

  const createExperience = useCreateExperience({ cvId });
  const updateExperience = useUpdateExperience({ cvId });
  const deleteExperience = useDeleteExperience({ cvId });

  const isAnyMutationInProgress =
    createExperience.isPending || updateExperience.isPending || deleteExperience.isPending;

  const handleAddExperience = () => {
    setIsCreating(true);
    setEditingExperience(null);
  };

  const handleEdit = (experience: CVExperience) => {
    if (!experience) {
      showError('Experience object is missing. Cannot edit experience.');
      return;
    }

    setEditingExperience(experience);
    setIsCreating(false);
  };

  const handleDelete = async (experienceId: string) => {
    if (!experienceId) {
      showError('Experience ID is missing. Cannot delete experience.');
      return;
    }

    if (deletingExperienceId === experienceId) return;
    setDeletingExperienceId(experienceId);

    try {
      await deleteExperience.mutateAsync(experienceId);
      showSuccess('Experience deleted successfully');
    } catch (err) {
      const axiosError = err as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
    } finally {
      setDeletingExperienceId(null);
    }
  };

  const handleFormSubmit = async (data: ExperienceFormValues) => {
    setIsLoading(true);

    try {
      if (isCreating) {
        await createExperience.mutateAsync({
          cvId,
          jobTitle: data.jobTitle,
          jobTitleId: data.jobTitleId,
          employmentTypeId: data.employmentTypeId,
          organization: data.organization,
          organizationId: data.organizationId,
          location: data.location,
          startDate: format(data.startDate, 'yyyy-MM-dd'),
          endDate: format(data.endDate, 'yyyy-MM-dd'),
          description: data.description,
        });
        showSuccess('Experience created successfully');
      } else if (editingExperience) {
        await updateExperience.mutateAsync({
          experienceId: editingExperience.id,
          experienceData: {
            jobTitle: data.jobTitle,
            jobTitleId: data.jobTitleId,
            employmentTypeId: data.employmentTypeId,
            organization: data.organization,
            organizationId: data.organizationId,
            location: data.location,
            startDate: format(data.startDate, 'yyyy-MM-dd'),
            endDate: format(data.endDate, 'yyyy-MM-dd'),
            description: data.description,
          },
        });
        showSuccess('Experience updated successfully');
      }

      setIsCreating(false);
      setEditingExperience(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      const axiosError = err as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingExperience(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
            <Button onClick={handleAddExperience} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CVExperienceList
            experiences={experiences || []}
            isLoading={isLoadingExperiences}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingExperienceId={deletingExperienceId}
            isDisabled={isAnyMutationInProgress}
          />
        </CardContent>
      </Card>

      {(isCreating || editingExperience) && (
        <CVExperienceForm
          editingExperience={editingExperience}
          isLoading={isLoading}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export { ExperienceSection };
