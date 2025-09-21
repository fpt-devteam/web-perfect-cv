import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import type { CVSummary, UpSertSummaryRequest } from '@/modules/summary/types/summary.types';

const summarySchema = z.object({
  content: z.string().min(10, { message: 'Content must be between 10-2000 characters' }),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

interface SummaryFormProps {
  initialData: CVSummary | undefined;
  onSubmit: (data: UpSertSummaryRequest) => void;
  isLoading?: boolean;
  cvId: string;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  cvId,
}) => {
  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      content: initialData?.content || '',
    },
  });

  const handleSubmit = (data: SummaryFormValues) => {
    if (!data.content || data.content.trim() === '') {
      return;
    }

    const processedData: UpSertSummaryRequest = {
      cvId,
      content: data.content.trim(),
    };

    onSubmit(processedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your summary here..."
                  {...field}
                  value={field.value || ''}
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isLoading}
            className="min-w-32"
          >
            {form.formState.isSubmitting && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {isLoading ? 'Saving...' : 'Save Summary'}
          </Button>
        </div>
      </form>
    </Form>
  );
};