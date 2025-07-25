import { DialogClose } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
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
import type { AxiosError } from 'axios';
import type { BaseError } from '@/shared/types/error.type';
import { useRef } from 'react';

const formSchema = z.object({
  title: z.string().min(1, { message: 'CV name is required' }),
  jobTitle: z.string().min(1, { message: 'Job title is required' }),
  companyName: z.string().min(1, { message: 'Company name is required' }),
  jobDescription: z.string().min(1, { message: 'Job description is required' }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCVForm() {
  const { showSuccess, showError } = useNotification();
  const { mutate: createCV, isPending } = useCreateCV();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      jobTitle: '',
      companyName: '',
      jobDescription: '',
    },
  });

  function onSubmit(values: FormValues) {
    const request: CreateCVRequest = {
      title: values.title,
      jobDetail: {
        jobTitle: values.jobTitle,
        companyName: values.companyName,
        description: values.jobDescription,
      },
    };

    createCV(request, {
      onSuccess: () => {
        showSuccess('Your CV has been created successfully');
        // Close the dialog only on successful creation
        closeButtonRef.current?.click();
      },
      onError: error => {
        showError(error as AxiosError<BaseError>);
      },
    });

    return true;
  }

  return (
    <div className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-sm">
                  CV NAME <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ImportOptions />

          <div className="border-t pt-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">JOB TITLE</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter here..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">COMPANY NAME</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter here..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">JOB DESCRIPTION</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Paste job description here..."
                        className="min-h-[120px] w-full p-2 border rounded-md"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-t pt-6 flex justify-end">
            {/* Hidden DialogClose button that we'll trigger programmatically */}
            <DialogClose asChild>
              <button ref={closeButtonRef} style={{ display: 'none' }} title="Close dialog" />
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create CV'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
