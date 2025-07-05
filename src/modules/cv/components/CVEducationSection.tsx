import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { GraduationCap, Calendar, MapPin, Plus, Trash2, Edit3, Award, Building } from 'lucide-react';
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
    useListEducations,
    useCreateEducation,
    useUpdateEducation,
    useDeleteEducation
} from '@/modules/cv/hooks/useEducation';
import { useGetDegree } from '@/modules/cv/hooks/useGetDegree';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import type { CVEducationResponse, CreateCVEducationRequest, UpdateCVEducationRequest, DegreeResponse } from '@/modules/cv/types/cv.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

const educationSchema = z.object({
    degree: z.string().min(1, 'Degree is required'),
    degreeId: z.string().min(1, 'Degree is required'),
    organization: z.string().min(1, 'Institution is required'),
    fieldOfStudy: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    description: z.string().nullable(),
    gpa: z.number().min(0).max(4).nullable(),
    location: z.string().nullable(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface CVEducationFormProps {
    cvId: string;
    onSuccess?: () => void;
}

export function CVEducationSection({ cvId }: { readonly cvId: string }) {
    return <CVEducationForm cvId={cvId} />;
}

export function CVEducationForm({ cvId, onSuccess }: CVEducationFormProps) {
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

    const isAnyMutationInProgress = createEducation.isPending || updateEducation.isPending || deleteEducation.isPending;

    const form = useForm<EducationFormValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            degree: '',
            degreeId: '',
            organization: '',
            fieldOfStudy: '',
            startDate: null,
            endDate: null,
            description: '',
            gpa: null,
            location: '',
        },
    });

    const resetForm = () => {
        form.reset({
            degree: '',
            degreeId: '',
            organization: '',
            fieldOfStudy: '',
            startDate: null,
            endDate: null,
            description: '',
            gpa: null,
            location: '',
        });
        setIsCreating(false);
        setEditingEducation(null);
    };

    const onSubmit = async (data: EducationFormValues) => {
        setIsLoading(true);
        try {
            if (editingEducation) {
                const updateData: UpdateCVEducationRequest = {
                    id: editingEducation.id,
                    degree: data.degree,
                    degreeId: data.degreeId,
                    organization: data.organization,
                    organizationId: null,
                    location: data.location,
                    fieldOfStudy: data.fieldOfStudy,
                    startDate: data.startDate ? format(new Date(data.startDate), 'yyyy-MM-dd') : null,
                    endDate: data.endDate ? format(new Date(data.endDate), 'yyyy-MM-dd') : null,
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
                    degreeId: data.degreeId,
                    organization: data.organization,
                    organizationId: null,
                    location: data.location,
                    fieldOfStudy: data.fieldOfStudy,
                    startDate: data.startDate ? format(new Date(data.startDate), 'yyyy-MM-dd') : null,
                    endDate: data.endDate ? format(new Date(data.endDate), 'yyyy-MM-dd') : null,
                    description: data.description,
                    gpa: data.gpa,
                };
                await createEducation.mutateAsync(createData);
                showSuccess('Education added successfully');
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

    const handleEdit = (education: CVEducationResponse) => {
        setEditingEducation(education);
        form.reset({
            degree: education.degree,
            degreeId: '',
            organization: education.organization,
            fieldOfStudy: education.fieldOfStudy || '',
            startDate: education.startDate,
            endDate: education.endDate,
            description: education.description || '',
            gpa: education.gpa,
            location: '',
        });
    };

    const handleDelete = async (educationId: string) => {
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

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No date specified';
        return format(new Date(dateString), 'MMM yyyy');
    };

    const formatGPA = (gpa: number | null) => {
        if (gpa === null) return '';
        return gpa.toFixed(2);
    };

    const getEducationStatus = (startDate: string | null, endDate: string | null) => {
        if (!startDate) return 'Not specified';
        if (!endDate) return 'In Progress';
        return 'Completed';
    };

    const handleDegreeChange = (degreeId: string, degrees: DegreeResponse[]) => {
        const selectedDegree = degrees.find(degree => degree.id === degreeId);
        if (selectedDegree) {
            form.setValue('degree', selectedDegree.name);
            form.setValue('degreeId', degreeId);
        }
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
                            onClick={() => setIsCreating(true)}
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
                    {isLoadingEducations ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : educations && educations.length > 0 ? (
                        <div className="space-y-4">
                            {educations.map((education) => (
                                <div
                                    key={education.id}
                                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4 text-blue-600" />
                                                    {education.degree}
                                                </h3>
                                            </div>

                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full",
                                                getEducationStatus(education.startDate, education.endDate) === 'In Progress'
                                                    ? "bg-blue-100 text-blue-800"
                                                    : getEducationStatus(education.startDate, education.endDate) === 'Completed'
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                            )}>
                                                {getEducationStatus(education.startDate, education.endDate)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <Building className="h-3 w-3" />
                                            <span className="font-medium">{education.organization}</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                            {education.startDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(education.startDate)}
                                                </span>
                                            )}
                                            {education.endDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(education.endDate)}
                                                </span>
                                            )}
                                        </div>


                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(education)}
                                            className="h-8 w-8 p-0"
                                            disabled={isCreating || !!editingEducation || isAnyMutationInProgress}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(education.id)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            disabled={deletingEducationId === education.id || isCreating || !!editingEducation || isAnyMutationInProgress}
                                        >
                                            {deletingEducationId === education.id ? (
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
                            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No education added yet</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Add your educational background to showcase your qualifications
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {(isCreating || editingEducation) && (
                <Card>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="degreeId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Degree <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            if (degrees) {
                                                                handleDegreeChange(value, degrees);
                                                            }
                                                        }}
                                                        value={field.value || ''}
                                                    >
                                                        <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                                                            <SelectValue placeholder="Select a degree" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {degrees?.map((degree: DegreeResponse) => (
                                                                <SelectItem key={degree.id} value={degree.id}>
                                                                    {degree.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="organization"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Institution <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. University of Technology"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fieldOfStudy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Field of Study
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Computer Science"
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
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Location
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Ho Chi Minh City, Vietnam"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Start Date <span className="text-red-500">*</span>
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
                                                    End Date <span className="text-red-500">*</span>
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
                                        name="gpa"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    GPA (0-4.0)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="4"
                                                        placeholder="e.g. 3.75"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value === '' ? null : parseFloat(value));
                                                        }}
                                                    />
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
                                                    placeholder="Describe your academic achievements, relevant coursework, honors, or any additional details..."
                                                    className="min-h-[100px] resize-none"
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
                                            <GraduationCap className="h-4 w-4" />
                                        )}
                                        {editingEducation ? 'Update Education' : 'Add Education'}
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