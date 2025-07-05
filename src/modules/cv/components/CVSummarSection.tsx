import { z } from 'zod';
import { useGetSummary, useUpsertSummary } from '../hooks/useSummary';
import { useNotification } from '@/shared/hooks/useNotification';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UpSertSummaryRequest } from '../types/cv.types';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import { Card, CardContent, CardTitle, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Pencil } from 'lucide-react';
import { Textarea } from '@/shared/components/ui/textarea';

const summarySchema = z.object({
  context: z.string().min(1, { message: 'Summary cannot be empty' }),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

interface CVSummaryProps {
  cvId: string;
}

export function CVSummary({ cvId }: CVSummaryProps) {
  const { showError, showSuccess } = useNotification();
  const { data: summaryData, isLoading: isLoadingSummary } = useGetSummary({ cvId });
  const [isLoading, setIsLoading] = useState(false);
  const upsertSummary = useUpsertSummary({ cvId });

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      context: summaryData?.context ?? '',
    },
  });

  useEffect(() => {
    if (!isLoadingSummary && summaryData) {
      form.reset({
        context: summaryData.context ?? '',
      });
    }
  }, [isLoadingSummary, summaryData, form]);

  const onSubmit = async (data: SummaryFormValues) => {
    setIsLoading(true);

    if (!data.context || data.context === '') {
      setIsLoading(false);
      return;
    }

    const processedData: UpSertSummaryRequest = {
      cvId,
      context: !data.context || data.context === '' ? null : data.context,
    };

    await upsertSummary.mutateAsync(processedData, {
      onSuccess: () => {
        showSuccess('Summary updated successfully!');
      },
      onError: error => {
        showError(error as AxiosError<BaseError>);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  if (isLoadingSummary) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse text-sm text-muted-foreground">Loading summary...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Write a professional summary <span className="text-red-500">*</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Enter your summary here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-32">
                  {form.formState.isSubmitting && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {isLoading ? 'Loading' : 'Save Summary'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
