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
  context: z.string().min(10, { message: 'Context must be between 10-2000 characters' }),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

interface CVSummaryProps {
  cvId: string;
}

export function CVSummary({ cvId }: CVSummaryProps) {
  const { showError, showSuccess } = useNotification();
  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useGetSummary({ cvId });
  const [isLoading, setIsLoading] = useState(false);
  const upsertSummary = useUpsertSummary({ cvId });

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      context: '',
    },
  });

  useEffect(() => {
    if (!isLoadingSummary && summaryData) {
      // Safely handle null/undefined context
      const context = summaryData?.context || '';
      form.reset({
        context,
      });
    }
  }, [isLoadingSummary, summaryData, form]);

  const onSubmit = async (data: SummaryFormValues) => {
    setIsLoading(true);

    if (!data.context || data.context.trim() === '') {
      setIsLoading(false);
      showError({ message: 'Summary cannot be empty' } as AxiosError<BaseError>);
      return;
    }

    const processedData: UpSertSummaryRequest = {
      cvId,
      context: data.context.trim(),
    };

    try {
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
    } catch (error) {
      setIsLoading(false);
      showError(error as AxiosError<BaseError>);
    }
  };

  // Check if error is 404 (no summary exists yet) - treat as normal state
  const is404Error =
    summaryError && (summaryError as AxiosError<BaseError>)?.response?.status === 404;

  // Show error state only for non-404 errors
  if (summaryError && !is404Error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading summary</h3>
            <p className="text-gray-500 mb-4">Please try again later.</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                      <Textarea
                        placeholder="Enter your summary here..."
                        {...field}
                        value={field.value || ''}
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
        </CardContent>
      </Card>
    </div>
  );
}
