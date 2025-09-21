import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Award, CalendarIcon } from 'lucide-react';
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
import { cn } from '@/shared/utils/cn.util';
import { searchCompanies } from '@/modules/cv/services/search.service';
import type { CertificationResponse } from '@/modules/certification/types/certification.types';

const certificationFormSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  organization: z.string().min(1, 'Organization is required'),
  organizationId: z.string().nullable(),
  issuedDate: z.date().nullable(),
  description: z.string().nullable(),
});

type CertificationFormValues = z.infer<typeof certificationFormSchema>;

interface CertificationFormProps {
  editingCertification: CertificationResponse | null;
  isLoading: boolean;
  onSubmit: (data: CertificationFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CertificationForm({
  editingCertification,
  isLoading,
  onSubmit,
  onCancel,
}: CertificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editingCertification;

  const defaultValues: CertificationFormValues = useMemo(
    () => ({
      name: editingCertification?.name || '',
      organization: editingCertification?.organization || '',
      organizationId: editingCertification?.organizationId || null,
      issuedDate: editingCertification?.issuedDate
        ? new Date(editingCertification.issuedDate)
        : null,
      description: editingCertification?.description || '',
    }),
    [editingCertification]
  );

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = async (data: CertificationFormValues) => {
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
          <Award className="h-5 w-5" />
          {isEditing ? 'Edit Certification' : 'Add New Certification'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                      className="focus:ring-blue-500 focus:border-blue-500"
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
                      minSearchLength={1}
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
                  <FormLabel className="text-sm font-medium text-gray-700">Issue Date</FormLabel>
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
                          selected={field.value || undefined}
                          onSelect={date => field.onChange(date || null)}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the certification, skills covered, or any additional details..."
                      className="min-h-[100px] resize-none focus:ring-blue-500 focus:border-blue-500"
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
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : null}
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Certification'
                    : 'Add Certification'}
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
