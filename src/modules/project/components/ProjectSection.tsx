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
} from '@/modules/project/hooks/useProject';
import { ProjectList } from './ProjectList';
import { ProjectForm } from './ProjectForm';
import { ProjectView } from './ProjectView';
import type {
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '@/modules/project/types/project.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

type ProjectFormValues = {
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
  link: string | null;
};

interface ProjectSectionProps {
  cvId: string;
  onSuccess?: () => void;
}

export function ProjectSection({ cvId, onSuccess }: ProjectSectionProps) {
  const { showError, showSuccess } = useNotification();
  const { data: projects, isLoading: isLoadingProjects } = useListProjects({ cvId });
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
  const [viewingProject, setViewingProject] = useState<ProjectResponse | null>(null);
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
        const updateData: UpdateProjectRequest = {
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
        const createData: CreateProjectRequest = {
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

  const handleEdit = (project: ProjectResponse) => {
    setEditingProject(project);
    setIsCreating(false);
  };

  const handleView = (project: ProjectResponse) => {
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
          <ProjectList
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
        <ProjectForm
          editingProject={editingProject}
          isLoading={isAnyMutationInProgress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {viewingProject && (
        <ProjectView
          project={viewingProject}
          isOpen={!!viewingProject}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
}