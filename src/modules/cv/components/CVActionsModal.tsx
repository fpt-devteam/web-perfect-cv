import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { useNotification } from '@/shared/hooks/useNotification';
import { useUpdateCV, useDeleteCV, useCVData } from '@/modules/cv/hooks';
import type { CVResponse } from '@/modules/cv/types/cv.types';

const updateCVSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  jobTitle: z.string().min(1, 'Job title is required'),
  companyName: z.string().min(1, 'Company name is required'),
  responsibility: z.string().min(1, 'Responsibility is required'),
  qualification: z.string().min(1, 'Qualification is required'),
});

type UpdateCVFormValues = z.infer<typeof updateCVSchema>;

interface CVActionsModalProps {
  cv: CVResponse;
  trigger: React.ReactNode;
}

export function CVActionsModal({ cv, trigger }: CVActionsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { showSuccess, showError } = useNotification();
  const updateCVMutation = useUpdateCV();
  const deleteCVMutation = useDeleteCV();

  // Fetch detailed CV data only when modal is open
  const { data: cvDetailData, isLoading: isLoadingCVDetail } = useCVData(cv.cvId, { enabled: isOpen });

  const form = useForm<UpdateCVFormValues>({
    resolver: zodResolver(updateCVSchema),
    defaultValues: {
      title: cv.title || '',
      jobTitle: cv.jobDescription?.title || '',
      companyName: cv.jobDescription?.companyName || '',
      responsibility: cv.jobDescription?.responsibility || '',
      qualification: cv.jobDescription?.qualification || '',
    },
  });

  // Update form when detailed CV data is loaded
  useEffect(() => {
    if (cvDetailData && isOpen) {
      form.reset({
        title: cvDetailData.title || '',
        jobTitle: cvDetailData.jobDescription?.title || '',
        companyName: cvDetailData.jobDescription?.companyName || '',
        responsibility: cvDetailData.jobDescription?.responsibility || '',
        qualification: cvDetailData.jobDescription?.qualification || '',
      });
    }
  }, [cvDetailData, isOpen, form]);

  const handleUpdateCV = async (data: UpdateCVFormValues) => {
    console.log('handleUpdateCV called with:', data);
    try {
      const request = {
        title: data.title,
        jobDescription: {
          title: data.jobTitle,
          companyName: data.companyName,
          responsibility: data.responsibility,
          qualification: data.qualification,
        },
        analysisId: null, // Có thể cập nhật sau nếu cần
      };

      await updateCVMutation.mutateAsync({
        cvId: cv.cvId,
        request,
      });
      showSuccess('CV updated successfully');
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Update CV error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update CV';
      showError(errorMessage);
    }
  };

  const handleDeleteCV = async () => {
    try {
      await deleteCVMutation.mutateAsync({
        cvId: cv.cvId,
      });
      showSuccess('CV deleted successfully');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Delete CV error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete CV';
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
  };

  const handleInputClick = (e: React.MouseEvent | React.FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={e => e.stopPropagation()}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="relative">
          {(updateCVMutation.isPending || deleteCVMutation.isPending) && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-sm font-medium text-gray-700">
                  {updateCVMutation.isPending ? 'Updating CV...' : 'Deleting CV...'}
                </span>
              </div>
            </div>
          )}
          {isLoadingCVDetail && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-gray-500">Loading CV details...</span>
            </div>
          )}
          <Form {...form}>
            <div className="flex flex-col gap-8">
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
                          <Input
                            {...field}
                            placeholder="Enter here..."
                            disabled={updateCVMutation.isPending || isLoadingCVDetail}
                            onClick={handleInputClick}
                            onFocus={handleInputClick}
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
                      Update the details about the role you are targeting so we can tailor your CV accordingly.
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
                            <Input
                              {...field}
                              placeholder="e.g. Software Engineer"
                              disabled={updateCVMutation.isPending || isLoadingCVDetail}
                              onClick={handleInputClick}
                              onFocus={handleInputClick}
                            />
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
                            <Input
                              {...field}
                              placeholder="e.g. VNG Corporation"
                              disabled={updateCVMutation.isPending || isLoadingCVDetail}
                              onClick={handleInputClick}
                              onFocus={handleInputClick}
                            />
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
                              {...field}
                              placeholder="e.g. Backend engineer responsible for developing scalable web applications..."
                              className="min-h-28"
                              disabled={updateCVMutation.isPending || isLoadingCVDetail}
                              onClick={handleInputClick}
                              onFocus={handleInputClick}
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
                              {...field}
                              placeholder="e.g. Bachelor Degree. Good at algorithm and data structures..."
                              className="min-h-28"
                              disabled={updateCVMutation.isPending || isLoadingCVDetail}
                              onClick={handleInputClick}
                              onFocus={handleInputClick}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>
                </div>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={updateCVMutation.isPending || isLoadingCVDetail}
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    onClick={form.handleSubmit(handleUpdateCV)}
                    disabled={updateCVMutation.isPending || isLoadingCVDetail}
                  >
                    {updateCVMutation.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
            </div>
          </Form>

          {/* Delete CV Section */}
          <div className="border-t border-gray-100 pt-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">Danger Zone</h4>
              <p className="text-sm text-red-600 mb-4">
                This action cannot be undone. The CV will be permanently deleted.
              </p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={e => {
                  handleButtonClick(e);
                  handleDeleteCV();
                }}
                disabled={deleteCVMutation.isPending}
              >
                {deleteCVMutation.isPending ? 'Deleting...' : 'Delete CV'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
