import { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useNotification } from '@/shared/hooks/useNotification';
import {
  useListProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/modules/cv/hooks/useProject';
import { CVProjectList } from './CVProjectList';
import { CVProjectForm } from './CVProjectForm';
import { CVProjectView } from './CVProjectView';
import type {
  CVProjectResponse,
  CreateCVProjectRequest,
  UpdateCVProjectRequest,
} from '@/modules/cv/types/cv.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

type ProjectFormValues = {
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
  link: string | null;
};

interface CVProjectSectionProps {
  cvId: string;
  onSuccess?: () => void;
}

export function CVProjectSection({ cvId, onSuccess }: CVProjectSectionProps) {
  const { showError, showSuccess } = useNotification();
  const { data: projects, isLoading: isLoadingProjects } = useListProjects({ cvId });
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<CVProjectResponse | null>(null);
  const [viewingProject, setViewingProject] = useState<CVProjectResponse | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const createProject = useCreateProject({ cvId });
  const updateProject = useUpdateProject({ cvId });
  const deleteProject = useDeleteProject({ cvId });

  const isAnyMutationInProgress =
    createProject.isPending || updateProject.isPending || deleteProject.isPending;

  const resetForm = () => {
    setIsCreating(false);
    setEditingProject(null);
  };

  const handleSubmit = async (data: ProjectFormValues) => {
    try {
      if (editingProject) {
        const updateData: UpdateCVProjectRequest = {
          title: data.title,
          description: data.description || '',
          link: data.link || null,
          startDate: data.startDate ? format(data.startDate, 'yyyy-MM-dd') : null,
          endDate: data.endDate ? format(data.endDate, 'yyyy-MM-dd') : null,
        };
        await updateProject.mutateAsync({
          projectId: editingProject.id,
          projectData: updateData,
        });
        showSuccess('Project updated successfully');
      } else {
        const createData: CreateCVProjectRequest = {
          cvId,
          title: data.title,
          description: data.description || '',
          link: data.link || null,
          startDate: data.startDate ? format(data.startDate, 'yyyy-MM-dd') : null,
          endDate: data.endDate ? format(data.endDate, 'yyyy-MM-dd') : null,
        };
        await createProject.mutateAsync(createData);
        showSuccess('Project added successfully');
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

  const handleEdit = (project: CVProjectResponse) => {
    setEditingProject(project);
    setIsCreating(false);
  };

  const handleView = (project: CVProjectResponse) => {
    setViewingProject(project);
  };

  const handleDelete = async (projectId: string) => {
    if (deletingProjectId === projectId) return;
    setDeletingProjectId(projectId);
    try {
      await deleteProject.mutateAsync(projectId);
      showSuccess('Project deleted successfully');
    } catch (error) {
      const axiosError = error as AxiosError<BaseError>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      showError(errorMessage);
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleAddProject = () => {
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleCloseView = () => {
    setViewingProject(null);
  };

  const showForm = isCreating || !!editingProject;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Projects
              {isAnyMutationInProgress && (
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2" />
              )}
            </CardTitle>
            <Button
              onClick={handleAddProject}
              size="sm"
              className="flex items-center gap-2"
              disabled={showForm || isAnyMutationInProgress}
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <CVProjectList
            projects={projects}
            isLoading={isLoadingProjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            deletingProjectId={deletingProjectId}
            disabled={showForm || isAnyMutationInProgress}
          />
        </CardContent>
      </Card>

      {showForm && (
        <CVProjectForm
          editingProject={editingProject}
          isLoading={isAnyMutationInProgress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {viewingProject && (
        <CVProjectView
          project={viewingProject}
          isOpen={!!viewingProject}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
}
