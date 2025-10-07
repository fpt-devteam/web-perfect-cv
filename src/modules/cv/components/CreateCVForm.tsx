import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCreateCV } from '@/modules/cv/hooks/useCreateCV';
import type { CreateCVRequest } from '@/modules/cv/types/cv.types';
import { ImportOptions } from '@/modules/cv/components/ImportOption';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { useNotification } from '@/shared/hooks/useNotification';
import { useNavigate } from '@tanstack/react-router';
import { useCVData } from '@/modules/cv/hooks';
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const formSchema = z.object({
  title: z.string().min(1, { message: 'CV name is required' }),
  jobTitle: z.string().min(1, { message: 'Job title is required' }),
  companyName: z.string().min(1, { message: 'Company name is required' }),
  responsibility: z.string().min(1, { message: 'Responsibility is required' }),
  qualification: z.string().min(1, { message: 'Qualification is required' }),
  pdfFile: z
    .instanceof(File, { message: 'Only PDF files are allowed' })
    .refine(file => file.type === 'application/pdf', { message: 'Only PDF files are allowed' })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `File size must be ${MAX_FILE_SIZE_MB}MB or less`,
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCVFormProps {
  onSuccess?: () => void;
}

export function CreateCVForm({ onSuccess }: CreateCVFormProps = {}) {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [createdCVId, setCreatedCVId] = useState<string | null>(null);
  const { mutate: createCV, isPending: isCreating } = useCreateCV();

  // Poll the created CV for structure completion
  const { data: cvData } = useCVData(createdCVId || '', {
    enabled: !!createdCVId
  });

  const isPending = isCreating || (!!createdCVId && !cvData?.isStructuredDone);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      jobTitle: '',
      companyName: '',
      responsibility: '',
      qualification: '',
      pdfFile: undefined,
    },
  });

  // Handle when CV structuring is complete
  useEffect(() => {
    if (cvData?.isStructuredDone && createdCVId) {
      // Show final success message and navigate
      showSuccess('Your CV has been processed successfully!');
      form.reset();
      onSuccess?.(); // Close the dialog
      navigate({ to: `/dashboard/cvs/${createdCVId}/contact` });
      setCreatedCVId(null); // Reset state
    }
  }, [cvData?.isStructuredDone, createdCVId, showSuccess, form, onSuccess, navigate]);

  function onSubmit(values: FormValues) {
    const request: CreateCVRequest = {
      title: values.title,
      jobDescription: {
        title: values.jobTitle,
        companyName: values.companyName,
        responsibility: values.responsibility,
        qualification: values.qualification,
      },
      pdfFile: values.pdfFile,
    };

    createCV(request, {
      onSuccess: (data) => {
        showSuccess('CV created! Processing your content...');
        setCreatedCVId(data.cvId);
        // Don't close dialog yet, wait for structuring to complete
      },
      onError: error => {
        console.error('Create CV error:', error);
        showError(error as AxiosError<BaseError>);
      },
    });
  }

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-sm font-medium text-gray-700">
              {isCreating ? 'Creating your CV...' : 'Processing CV content...'}
            </span>
            {createdCVId && (
              <p className="text-xs text-gray-500 text-center max-w-sm">
                We're analyzing and structuring your CV content. This may take a moment.
              </p>
            )}
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      CV NAME <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pdfFile"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      IMPORT YOUR EXISTING CV (PDF)
                    </FormLabel>
                    <FormControl>
                      <ImportOptions
                        selectedFile={field.value}
                        onSelectFile={file => field.onChange(file)}
                        isInvalid={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900">
                  Job Description <span className="text-red-500">*</span>
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Provide some details about the role you are targeting so we can tailor your CV accordingly.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        JOB TITLE <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        COMPANY NAME <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. VNG Corporation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibility"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        RESPONSIBILITY <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Backend engineer responsible for developing scalable web applications..."
                          className="min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        QUALIFICATION <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Bachelor Degree. Good at algorithm and data structures..."
                          className="min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create CV'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
