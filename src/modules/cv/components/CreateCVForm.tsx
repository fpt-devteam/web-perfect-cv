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
  targetCv: z.boolean(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  jobDescription: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCVForm() {
  const { showSuccess, showError } = useNotification();
  const { mutate: createCV, isPending } = useCreateCV();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      targetCv: false,
      jobTitle: '',
      companyName: '',
      jobDescription: '',
    },
  });

  const targetCv = form.watch('targetCv');

  function onSubmit(values: FormValues) {
    const request: CreateCVRequest = {
      title: values.title,
      jobDetail: values.targetCv
        ? {
          jobTitle: values.jobTitle ?? '',
          companyName: values.companyName ?? '',
          description: values.jobDescription ?? '',
        }
        : null,
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Target your CV</h3>
              <FormField
                control={form.control}
                name="targetCv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Target your CV</FormLabel>
                    <FormControl>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="toggle"
                          className="sr-only"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <label
                          htmlFor="toggle"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${field.value ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`block h-6 w-6 rounded-full transform transition-transform ${field.value ? 'translate-x-4 bg-white' : 'translate-x-0 bg-white'}`}
                          />
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {targetCv && (
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
            )}
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
