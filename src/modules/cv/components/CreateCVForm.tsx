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

const formSchema = z.object({
  title: z.string().min(1, { message: 'CV name is required' }),
  jobTitle: z.string().min(1, { message: 'Job title is required' }),
  companyName: z.string().min(1, { message: 'Company name is required' }),
  responsibility: z.string().min(1, { message: 'Responsibility is required' }),
  qualification: z.string().min(1, { message: 'Qualification is required' }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCVForm() {
  const { showSuccess, showError } = useNotification();
  const { mutate: createCV, isPending } = useCreateCV();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      jobTitle: '',
      companyName: '',
      responsibility: '',
      qualification: '',
    },
  });

  function onSubmit(values: FormValues) {
    const request: CreateCVRequest = {
      title: values.title,
      jobDescription: {
        title: values.jobTitle,
        companyName: values.companyName,
        responsibility: values.responsibility,
        qualification: values.qualification,
      },
    };

    createCV(request, {
      onSuccess: () => {
        showSuccess('Your CV has been created successfully');
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
            <div className="mb-4">
              <h3 className="font-medium">Job Description <span className="text-red-500">*</span></h3>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">
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
                    <FormLabel className="font-medium text-sm">
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
                  <FormItem>
                    <FormLabel className="font-medium text-sm">
                      RESPONSIBILITY <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="e.g. Backend engineer responsible for developing scalable web applications..."
                        className="min-h-[100px] w-full p-2 border rounded-md resize-none"
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
                  <FormItem>
                    <FormLabel className="font-medium text-sm">
                      QUALIFICATION <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="e.g. Bachelor Degree. Good at algorithm and data structures..."
                        className="min-h-[100px] w-full p-2 border rounded-md resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-t pt-6 flex justify-end">
            <DialogClose asChild>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create CV'}
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
}
