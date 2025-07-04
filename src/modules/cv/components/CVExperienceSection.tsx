import { AIScoreCard } from '@/modules/cv/components/AIScoreCard';
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { SearchableInput } from '@/shared/components/ui/searchable-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState, useMemo } from 'react';
import type { CVExperience, EmploymentTypeResponse } from '@/modules/cv/types/cv.types';
import { useCreateExperience, useDeleteExperience, useListExperiences, useUpdateExperience } from '@/modules/cv/hooks/useExperiences';
import { formatCompanyName } from '@/shared/utils/utils';
import { useGetEmploymentType } from '@/modules/cv/hooks/useGetEmploymentType';
import { searchJobTitles, searchCompanies } from '@/modules/cv/services/search.service';
import { CvSectionTab } from '@/modules/cv/components/CvSectionTab';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn.util';
import type { AxiosError } from 'axios';
import { useNotification } from '@/shared/hooks/useNotification';
import type { BaseError } from '@/shared/types/error.type';
const experienceFormSchema = z.object({
    jobTitle: z.string().min(1, 'Job title is required'),
    jobTitleId: z.string().nullable(),
    employmentTypeId: z.string().min(1, 'Employment type is required'),
    organizationName: z.string().min(1, 'Company is required'),
    organizationId: z.string().nullable(),
    location: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    description: z.string().nullable(),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

function ExperienceDetailView({ cvId, experience, isCreating }: { readonly cvId: string, readonly experience: CVExperience, readonly isCreating: boolean }) {
    const { data: employmentTypes, isPending } = useGetEmploymentType();
    const { showSuccess, showError } = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateExperience = useUpdateExperience({ cvId });
    const createExperience = useCreateExperience({ cvId });

    console.log('Experience:', experience);

    const defaultValues: ExperienceFormValues = useMemo(() => ({
        jobTitle: experience.jobTitle,
        jobTitleId: experience.jobTitleId,
        employmentTypeId: experience.employmentTypeId,
        organizationName: experience.organization,
        organizationId: experience.organizationId,
        location: experience.location,
        startDate: new Date(experience.startDate),
        endDate: experience.endDate ? new Date(experience.endDate) : new Date(),
        description: experience.description,
    }), [experience]);

    const form = useForm<ExperienceFormValues>({
        resolver: zodResolver(experienceFormSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const onSubmit = async (data: ExperienceFormValues) => {
        setIsSubmitting(true);
        console.log('Form submitted:', data);

        if (isCreating) {
            const res = await createExperience.mutateAsync({
                cvId,
                jobTitle: data.jobTitle,
                jobTitleId: data.jobTitleId ?? null,
                employmentTypeId: data.employmentTypeId,
                organization: data.organizationName,
                organizationId: data.organizationId ?? null,
                location: data.location,
                startDate: format(data.startDate, 'yyyy-MM-dd'),
                endDate: format(data.endDate, 'yyyy-MM-dd'),
                description: data.description ?? null,
            },
                {
                    onSuccess: () => {
                        showSuccess('Experience created successfully');
                    },
                    onError: error => {
                        showError(error as AxiosError<BaseError>);
                    },
                    onSettled: () => {
                        setIsSubmitting(false);
                    },
                });
            console.log('Experience created successfully:', res);
        } else {

            const res = await updateExperience.mutateAsync({
                experienceId: experience.id,
                experienceData: {
                    jobTitle: data.jobTitle,
                    jobTitleId: data.jobTitleId ?? null,
                    employmentTypeId: data.employmentTypeId,
                    organization: data.organizationName,
                    organizationId: data.organizationId ?? null,
                    location: data.location,
                    startDate: format(data.startDate, 'yyyy-MM-dd'),
                    endDate: format(data.endDate, 'yyyy-MM-dd'),
                    description: data.description ?? null,
                },
            },
                {
                    onSuccess: () => {
                        showSuccess('Experience updated successfully');
                    },
                    onError: error => {
                        showError(error as AxiosError<BaseError>);
                    },
                    onSettled: () => {
                        setIsSubmitting(false);
                    },
                });
            console.log('Experience updated successfully:', res);
        }
        setIsSubmitting(false);
    };

    return (
        <Card className="h-full shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Experience Details</CardTitle>
                <p className="text-sm text-gray-600">
                    {experience.jobTitle} at {formatCompanyName(experience.organization)}
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="jobTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Job title <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <SearchableInput
                                                value={field.value}
                                                onChange={(val: string) => {
                                                    field.onChange(val);
                                                    form.setValue('jobTitleId', null);
                                                }}
                                                onSearch={searchJobTitles}
                                                onSelect={item => form.setValue('jobTitleId', item.id)}
                                                placeholder="e.g. Software Engineer"
                                                className="focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="organizationName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Company <span className="text-red-500">*</span>
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
                                                placeholder="e.g. Google"
                                                className="focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="employmentTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Employment Type <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue placeholder="Select employment type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {employmentTypes?.map((type: EmploymentTypeResponse) => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g. New York, NY"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <div className="space-y-4">
                                <Label className="text-sm font-medium text-gray-700">
                                    How long were you with the company? <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-4">
                                    <FormField
                                        name="startDate"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(new Date(field.value), "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => field.onChange(date ?? undefined)}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            captionLayout="dropdown"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        name="endDate"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(new Date(field.value), "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => field.onChange(date ?? undefined)}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            captionLayout="dropdown"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Job description & achievements
                                        </FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Textarea
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        className="min-h-[140px] pl-4 pr-12 resize-none focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="• Organized cross-functional sprint reviews with engineers, designers, and product managers&#10;• Developed responsive web applications using React and TypeScript&#10;"
                                                        style={{
                                                            lineHeight: '1.6',
                                                            fontFamily: 'inherit',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Experience'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function ExperienceSection({ cvId }: { readonly cvId: string }) {
    const [selectedExperienceId, setSelectedExperienceId] = useState<string>();
    const [experienceList, setExperienceList] = useState<CVExperience[]>([]);
    const { data: experiences, isLoading } = useListExperiences({ cvId });
    const [creatingExperience, setCreatingExperience] = useState<string[]>([]);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        if (!isLoading && experiences && experiences.length > 0 && !selectedExperienceId) {
            setSelectedExperienceId(experiences[0].id);
            if (experiences) {
                setExperienceList(experiences);
            } else {
                const tempExp = generateNewTempExperience();
                setExperienceList([...experienceList, tempExp]);
                setCreatingExperience(prev => [...prev, tempExp.id]);
            }
        }
    }, [experiences, isLoading, selectedExperienceId]);

    const generateNewTempExperience = () => {
        const tempId = `temp-${Date.now()}`;

        return {
            id: tempId,
            cvId,
            jobTitle: 'Untitled',
            jobTitleId: null,
            employmentTypeId: '',
            employmentTypeName: '',
            organizationId: null,
            organization: '',
            location: '',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            description: '',
            createdAt: '',
            updatedAt: '',
        } as CVExperience;
    }

    const handleChangeSelectedExperienceId = (id: string) => setSelectedExperienceId(id);

    const selectedExperience = experienceList?.find(exp => exp.id === selectedExperienceId) ?? generateNewTempExperience();

    const handleAddExperience = () => {
        console.log('Add new experience clicked');
        const newItem = generateNewTempExperience();
        setExperienceList(prev => [...prev, newItem]);
        setCreatingExperience(prev => [...prev, newItem.id]);
        setSelectedExperienceId(newItem.id);
    };

    const deleteExperience = useDeleteExperience({ cvId });

    const handleDeleteExperience = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this experience?');
        if (!confirmDelete) return;

        try {
            await deleteExperience.mutateAsync(selectedExperienceId ?? '');
            showSuccess('Experience deleted successfully');
            setExperienceList(experienceList.filter(exp => exp.id !== selectedExperienceId));
        } catch (error) {
            showError('Error occurred while deleting experience');
        }
    };

    const handleUnShowExperience = (id: string) => {
    };

    return (
        <div className="w-full flex gap-6 p-6 bg-gray-50 min-h-screen">
            <div className="w-80 flex flex-col gap-6">
                <AIScoreCard />
                <CvSectionTab
                    title="Your Experience"
                    tabItems={experienceList.map(exp => ({
                        id: exp.id,
                        title: exp.jobTitle,
                        detail: formatCompanyName(exp.organization) || "Detail"
                    }))}
                    selectedId={selectedExperienceId}
                    onChange={handleChangeSelectedExperienceId}
                    onAdd={handleAddExperience}
                    onDelete={handleDeleteExperience}
                    onUnShow={handleUnShowExperience}
                />
            </div>
            <div className="flex-1">
                <ExperienceDetailView cvId={cvId} experience={selectedExperience} isCreating={creatingExperience.includes(selectedExperienceId ?? '')} />
            </div>
        </div>
    );
}

export default ExperienceSection;
