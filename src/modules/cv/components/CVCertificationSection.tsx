import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Award, Calendar, Building2, FileText, Plus, Trash2, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { SearchableInput } from '@/shared/components/ui/searchable-input';
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
    useListCertifications,
    useCreateCertification,
    useUpdateCertification,
    useDeleteCertification
} from '@/modules/cv/hooks/useCertification';
import { searchCompanies } from '@/modules/cv/services/search.service';
import type { CVCertificationResponse, CreateCVCertificationRequest, UpdateCVCertificationRequest } from '@/modules/cv/types/cv.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

const certificationSchema = z.object({
    name: z.string().min(1, 'Certification name is required'),
    issuedDate: z.string().nullable(),
    description: z.string().nullable(),
    organization: z.string().min(1, 'Organization is required'),
    organizationId: z.string().nullable(),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

interface CVCertificationFormProps {
    cvId: string;
    onSuccess?: () => void;
}

export function CVCertificationSection({ cvId }: { readonly cvId: string }) {
    return <CVCertificationForm cvId={cvId} />
}

export function CVCertificationForm({ cvId, onSuccess }: CVCertificationFormProps) {
    const { showError, showSuccess } = useNotification();
    const { data: certifications, isLoading: isLoadingCertifications } = useListCertifications({ cvId });
    const [isCreating, setIsCreating] = useState(false);
    const [editingCertification, setEditingCertification] = useState<CVCertificationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingCertificationId, setDeletingCertificationId] = useState<string | null>(null);

    const createCertification = useCreateCertification({ cvId });
    const updateCertification = useUpdateCertification({ cvId });
    const deleteCertification = useDeleteCertification({ cvId });

    const isAnyMutationInProgress = createCertification.isPending || updateCertification.isPending || deleteCertification.isPending;

    const form = useForm<CertificationFormValues>({
        resolver: zodResolver(certificationSchema),
        defaultValues: {
            name: '',
            issuedDate: null,
            description: '',
            organization: '',
            organizationId: null,
        },
    });

    const resetForm = () => {
        form.reset({
            name: '',
            issuedDate: null,
            description: '',
            organization: '',
            organizationId: null,
        });
        setIsCreating(false);
        setEditingCertification(null);
    };

    const onSubmit = async (data: CertificationFormValues) => {
        setIsLoading(true);
        try {
            if (editingCertification) {
                const updateData: UpdateCVCertificationRequest = {
                    name: data.name,
                    issuedDate: data.issuedDate ? format(new Date(data.issuedDate), 'yyyy-MM-dd') : null,
                    description: data.description,
                    organization: data.organization,
                    organizationId: data.organizationId,
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
                    issuedDate: data.issuedDate ? format(new Date(data.issuedDate), 'yyyy-MM-dd') : null,
                    description: data.description,
                    organization: data.organization,
                    organizationId: data.organizationId,
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (certification: CVCertificationResponse) => {
        setEditingCertification(certification);
        form.reset({
            name: certification.name,
            issuedDate: certification.issuedDate,
            description: certification.description || '',
            organization: certification.organization,
            organizationId: certification.organizationId,
        });
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
                            <Award className="h-5 w-5" />
                            Certifications
                            {isAnyMutationInProgress && (
                                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2" />
                            )}
                        </CardTitle>
                        <Button
                            onClick={() => setIsCreating(true)}
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={isCreating || !!editingCertification || isAnyMutationInProgress}
                        >
                            <Plus className="h-4 w-4" />
                            Add Certification
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {isLoadingCertifications ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : certifications && certifications.length > 0 ? (
                        <div className="space-y-4">
                            {certifications.map((certification) => (
                                <div
                                    key={certification.id}
                                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                                <Award className="h-4 w-4 text-blue-600" />
                                                {certification.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                {certification.organization}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(certification.issuedDate)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(certification)}
                                            className="h-8 w-8 p-0"
                                            disabled={isCreating || !!editingCertification || isAnyMutationInProgress}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(certification.id)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            disabled={deletingCertificationId === certification.id || isCreating || !!editingCertification || isAnyMutationInProgress}
                                        >
                                            {deletingCertificationId === certification.id ? (
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
                            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No certifications added yet</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Add your professional certifications to showcase your expertise
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {(isCreating || editingCertification) && (
                <Card>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Certification Name <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. AWS Certified Solutions Architect"
                                                    {...field}
                                                />
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
                                                Issuing Organization <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <SearchableInput
                                                    value={field.value}
                                                    onChange={(val: string) => {
                                                        field.onChange(val);
                                                        form.setValue('organizationId', null);
                                                    }}
                                                    onSearch={searchCompanies}
                                                    onSelect={item => form.setValue('organizationId', item.id)}
                                                    placeholder="e.g. Amazon Web Services"
                                                    className="focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="issuedDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Issue Date <span className="text-red-500">*</span>
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
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the certification, skills covered, or any additional details..."
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
                                            <FileText className="h-4 w-4" />
                                        )}
                                        {editingCertification ? 'Update Certification' : 'Add Certification'}
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
