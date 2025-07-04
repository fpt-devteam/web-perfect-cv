import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { FileText, Calendar, Link as LinkIcon, Plus, Trash2, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar as CalendarComponent } from '@/shared/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn.util';
import { useNotification } from '@/shared/hooks/useNotification';
import {
    useListProjects,
    useCreateProject,
    useUpdateProject,
    useDeleteProject
} from '@/modules/cv/hooks/useProject';
import type { CVProjectResponse, CreateCVProjectRequest, UpdateCVProjectRequest } from '@/modules/cv/types/cv.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

const projectSchema = z.object({
    title: z.string().min(1, 'Project title is required'),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    description: z.string().nullable(),
    link: z.string().url('Invalid URL').nullable().or(z.literal('')),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface CVProjectFormProps {
    cvId: string;
    onSuccess?: () => void;
}

export function CVProjectSection({ cvId }: { readonly cvId: string }) {
    return <CVProjectForm cvId={cvId} />;
}

export function CVProjectForm({ cvId, onSuccess }: CVProjectFormProps) {
    const { showError, showSuccess } = useNotification();
    const { data: projects, isLoading: isLoadingProjects } = useListProjects({ cvId });
    const [isCreating, setIsCreating] = useState(false);
    const [editingProject, setEditingProject] = useState<CVProjectResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

    const createProject = useCreateProject({ cvId });
    const updateProject = useUpdateProject({ cvId });
    const deleteProject = useDeleteProject({ cvId });

    const isAnyMutationInProgress = createProject.isPending || updateProject.isPending || deleteProject.isPending;

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            startDate: null,
            endDate: null,
            description: '',
            link: '',
        },
    });

    const resetForm = () => {
        form.reset({
            title: '',
            startDate: null,
            endDate: null,
            description: '',
            link: '',
        });
        setIsCreating(false);
        setEditingProject(null);
    };

    const onSubmit = async (data: ProjectFormValues) => {
        setIsLoading(true);
        try {
            if (editingProject) {
                const updateData: UpdateCVProjectRequest = {
                    title: data.title,
                    description: data.description || '',
                    link: data.link || null,
                    startDate: data.startDate ? format(new Date(data.startDate), 'yyyy-MM-dd') : null,
                    endDate: data.endDate ? format(new Date(data.endDate), 'yyyy-MM-dd') : null,
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
                    startDate: data.startDate ? format(new Date(data.startDate), 'yyyy-MM-dd') : null,
                    endDate: data.endDate ? format(new Date(data.endDate), 'yyyy-MM-dd') : null,
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (project: CVProjectResponse) => {
        setEditingProject(project);
        form.reset({
            title: project.title,
            startDate: project.startDate,
            endDate: project.endDate,
            description: project.description || '',
            link: project.link || '',
        });
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

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No date specified';
        return format(new Date(dateString), 'MMM yyyy');
    };

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
                            onClick={() => setIsCreating(true)}
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={isCreating || !!editingProject || isAnyMutationInProgress}
                        >
                            <Plus className="h-4 w-4" />
                            Add Project
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingProjects ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : projects && projects.length > 0 ? (
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                                            {project.title}
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline flex items-center">
                                                    <LinkIcon className="h-4 w-4" />
                                                </a>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            {project.startDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(project.startDate)}
                                                </span>
                                            )}
                                            {project.endDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(project.endDate)}
                                                </span>
                                            )}
                                        </div>
                                        {project.description && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(project)}
                                            className="h-8 w-8 p-0"
                                            disabled={isCreating || !!editingProject || isAnyMutationInProgress}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(project.id)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            disabled={deletingProjectId === project.id || isCreating || !!editingProject || isAnyMutationInProgress}
                                        >
                                            {deletingProjectId === project.id ? (
                                                <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No projects added yet</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Add your projects to showcase your experience
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {(isCreating || editingProject) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {editingProject ? 'Edit Project' : 'Add New Project'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Project Title <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. KOI Auction Website"
                                                    {...field}
                                                    disabled={!!editingProject}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Start Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={field.value ? new Date(field.value) : undefined}
                                                                onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
                                                                disabled={(date) =>
                                                                    date > new Date() || date < new Date("1900-01-01")
                                                                }
                                                                captionLayout="dropdown"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    End Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={field.value ? new Date(field.value) : undefined}
                                                                onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
                                                                disabled={(date) =>
                                                                    date > new Date() || date < new Date("1900-01-01")
                                                                }
                                                                captionLayout="dropdown"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the project, your role, technologies used, or any additional details..."
                                                    className="min-h-[100px] resize-none"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Project URL
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. https://your-project-link.com"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-center gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading || isAnyMutationInProgress}
                                        className="flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        ) : (
                                            <FileText className="h-4 w-4" />
                                        )}
                                        {editingProject ? 'Update Project' : 'Add Project'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                        disabled={isLoading || isAnyMutationInProgress}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
