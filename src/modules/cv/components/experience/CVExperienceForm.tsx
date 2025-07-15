import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { SearchableInput } from '@/shared/components/ui/searchable-input';
import { Calendar as CalendarComponent } from '@/shared/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { cn } from '@/shared/utils/cn.util';
import { useGetEmploymentType } from '@/modules/cv/hooks/useGetEmploymentType';
import { searchJobTitles, searchCompanies } from '@/modules/cv/services/search.service';
import type { CVExperience, EmploymentTypeResponse } from '@/modules/cv/types/cv.types';

const experienceFormSchema = z
  .object({
    jobTitle: z.string().min(1, 'Job title is required'),
    jobTitleId: z.string().nullable(),
    employmentTypeId: z.string().min(1, 'Employment type is required'),
    organization: z.string().min(1, 'Organization is required'),
    organizationId: z.string().nullable(),
    location: z.string().min(1, 'Location is required'),
    startDate: z.date(),
    endDate: z.date(),
    description: z.string().nullable(),
  })
  .refine(data => data.endDate >= data.startDate, {
    message: 'End date must be greater than or equal to start date',
    path: ['endDate'],
  });

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

interface CVExperienceFormProps {
  editingExperience: CVExperience | null;
  isLoading: boolean;
  onSubmit: (data: ExperienceFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CVExperienceForm({
  editingExperience,
  isLoading,
  onSubmit,
  onCancel,
}: CVExperienceFormProps) {
  const { data: employmentTypes } = useGetEmploymentType();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editingExperience;

  const defaultValues: ExperienceFormValues = useMemo(
    () => ({
      jobTitle: editingExperience?.jobTitle || '',
      jobTitleId: editingExperience?.jobTitleId || null,
      employmentTypeId: editingExperience?.employmentTypeId || '',
      organization: editingExperience?.organization || '',
      organizationId: editingExperience?.organizationId || null,
      location: editingExperience?.location || '',
      startDate: editingExperience?.startDate ? new Date(editingExperience.startDate) : new Date(),
      endDate: editingExperience?.endDate ? new Date(editingExperience.endDate) : new Date(),
      description: editingExperience?.description || null,
    }),
    [editingExperience]
  );

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = async (data: ExperienceFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {isEditing ? 'Edit Experience' : 'Add New Experience'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                        minSearchLength={1}
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
                      Organization <span className="text-red-500">*</span>
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
                        minSearchLength={1}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={date => field.onChange(date || new Date())}
                            disabled={date => date > new Date() || date < new Date('1900-01-01')}
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
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={date => field.onChange(date || new Date())}
                            disabled={date => date > new Date() || date < new Date('1900-01-01')}
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
                    Job description & achievements
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      className="min-h-[140px] resize-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="• Organized cross-functional sprint reviews with engineers, designers, and product managers&#10;• Developed responsive web applications using React and TypeScript&#10;"
                      style={{
                        lineHeight: '1.6',
                        fontFamily: 'inherit',
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : null}
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Experience' : 'Add Experience'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
