import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { GraduationCap, CalendarIcon } from 'lucide-react';
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
import { cn } from '@/shared/utils/cn.util';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { searchSchools } from '@/modules/cv/services/search.service';
import type {
  CVEducationResponse,
  DegreeResponse,
  SearchableItemResponse,
} from '@/modules/cv/types/cv.types';

// Schema for creating education (more lenient)
const createEducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  organization: z.string().min(1, 'Organization is required'),
  location: z.string().nullable(),
  fieldOfStudy: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  description: z.string().nullable(),
  gpa: z.number().min(0).max(4).nullable(),
});

// Schema for updating education (more strict)
const updateEducationSchema = z
  .object({
    degree: z.string().min(1, 'Degree is required'),
    organization: z.string().min(1, 'Organization is required'),
    location: z.string().nullable(),
    fieldOfStudy: z.string().min(1, 'Field of study is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    description: z.string().nullable(),
    gpa: z.number().min(0).max(4).nullable(),
  })
  .refine(
    data => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'End date must be greater than or equal to start date',
      path: ['endDate'],
    }
  );

type EducationFormValues = {
  degree: string;
  organization: string;
  location: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
};

interface CVEducationFormProps {
  editingEducation: CVEducationResponse | null;
  degrees: DegreeResponse[] | undefined;
  isLoading: boolean;
  onSubmit: (data: EducationFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CVEducationForm({
  editingEducation,
  degrees,
  isLoading,
  onSubmit,
  onCancel,
}: CVEducationFormProps) {
  const isEditing = !!editingEducation;
  const schema = isEditing ? updateEducationSchema : createEducationSchema;

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      degree: editingEducation?.degree || '',
      organization: editingEducation?.organization || '',
      location: editingEducation?.location || '',
      fieldOfStudy: editingEducation?.fieldOfStudy || '',
      startDate: editingEducation?.startDate || undefined,
      endDate: editingEducation?.endDate || undefined,
      description: editingEducation?.description || '',
      gpa: editingEducation?.gpa || undefined,
    },
  });

  const handleOrganizationSearch = async (query: string): Promise<SearchableItemResponse[]> => {
    if (!query || query.length < 2) return [];

    try {
      const results = await searchSchools(query);
      return results;
    } catch (error) {
      console.error('Error searching organizations:', error);
      return [];
    }
  };

  const handleOrganizationSelect = (item: SearchableItemResponse) => {
    form.setValue('organization', item.name);
  };

  const handleSubmit = async (data: EducationFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Degree <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={value => {
                      const selectedDegree = degrees?.find(degree => degree.id === value);
                      if (selectedDegree) {
                        field.onChange(selectedDegree.name);
                      }
                    }}
                    value={degrees?.find(degree => degree.name === field.value)?.id || ''}
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
                  Organization <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <SearchableInput
                    value={field.value || ''}
                    onChange={field.onChange}
                    onSearch={handleOrganizationSearch}
                    onSelect={handleOrganizationSelect}
                    placeholder="e.g. University of Technology"
                    minSearchLength={1}
                    debounceMs={300}
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
                  Field of Study {isEditing && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Computer Science" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEditing && (
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Location</FormLabel>
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
          )}
          {!isEditing && (
            <FormField
              control={form.control}
              name="gpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">GPA (0-4.0)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      placeholder="e.g. 3.75"
                      {...field}
                      value={field.value || ''}
                      onChange={e => {
                        const value = e.target.value;
                        field.onChange(value === '' ? null : parseFloat(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Start Date {isEditing && <span className="text-red-500">*</span>}
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
                        {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={date => field.onChange(date ? date.toISOString() : null)}
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
                  End Date {isEditing && <span className="text-red-500">*</span>}
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
                        {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={date => field.onChange(date ? date.toISOString() : null)}
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

        {isEditing && (
          <FormField
            control={form.control}
            name="gpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">GPA (0-4.0)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="e.g. 3.75"
                    {...field}
                    value={field.value || ''}
                    onChange={e => {
                      const value = e.target.value;
                      field.onChange(value === '' ? null : parseFloat(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
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
          <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <GraduationCap className="h-4 w-4" />
            )}
            {editingEducation ? 'Update Education' : 'Add Education'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
