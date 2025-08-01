import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useUpdateCV, useDeleteCV } from '@/modules/cv/hooks';
import { useCVData } from '@/modules/cv/hooks/useCVData';
import type { CVResponse } from '@/modules/cv/types/cv.types';

const updateCVSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  jobTitle: z.string().min(1, 'Job title is required'),
  companyName: z.string().min(1, 'Company name is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
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

  // Fetch detailed CV data when modal is open
  const { data: cvDetailData, isLoading: isLoadingCVDetail } = useCVData(cv.cvId);

  const form = useForm<UpdateCVFormValues>({
    resolver: zodResolver(updateCVSchema),
    defaultValues: {
      title: cv.title,
      jobTitle: cv.jobDetail?.jobTitle || '',
      companyName: cv.jobDetail?.companyName || '',
      jobDescription: cv.jobDetail?.description || '',
    },
  });

  // Update form when detailed CV data is loaded
  useEffect(() => {
    if (cvDetailData && isOpen) {
      form.reset({
        title: cvDetailData.title,
        jobTitle: cvDetailData.jobDetail?.jobTitle || '',
        companyName: cvDetailData.jobDetail?.companyName || '',
        jobDescription: cvDetailData.jobDetail?.description || '',
      });
    }
  }, [cvDetailData, isOpen, form]);

  const handleUpdateCV = async (data: UpdateCVFormValues) => {
    console.log('handleUpdateCV called with:', data);
    try {
      const request = {
        title: data.title,
        jobDetail: {
          jobTitle: data.jobTitle,
          companyName: data.companyName,
          description: data.jobDescription,
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
    } catch (error) {
      console.error('Update CV error:', error);
      showError('Failed to update CV');
    }
  };

  const handleDeleteCV = async () => {
    try {
      await deleteCVMutation.mutateAsync({
        cvId: cv.cvId,
      });
      showSuccess('CV deleted successfully');
      setIsOpen(false);
    } catch {
      showError('Failed to delete CV');
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
      <DialogContent className="max-w-md" onClick={e => e.stopPropagation()}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>CV Options</DialogTitle>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Edit CV Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Edit CV</h3>
            {isLoadingCVDetail && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-gray-500">Loading CV details...</span>
              </div>
            )}
            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">CV Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter CV title"
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
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Job Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter job title"
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
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter company name"
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
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Job Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter job description"
                          disabled={updateCVMutation.isPending || isLoadingCVDetail}
                          onClick={handleInputClick}
                          onFocus={handleInputClick}
                          className="min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={updateCVMutation.isPending || isLoadingCVDetail}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      console.log('Update button clicked');
                      const formData = form.getValues();
                      console.log('Form data:', formData);
                      if (
                        formData.title &&
                        formData.title.trim() &&
                        formData.jobTitle &&
                        formData.jobTitle.trim() &&
                        formData.companyName &&
                        formData.companyName.trim() &&
                        formData.jobDescription &&
                        formData.jobDescription.trim()
                      ) {
                        handleUpdateCV(formData);
                      } else {
                        showError('Please fill in all required fields');
                      }
                    }}
                    disabled={updateCVMutation.isPending || isLoadingCVDetail}
                  >
                    {updateCVMutation.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>
            </Form>
          </div>

          {/* Delete CV Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Delete CV</h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone. The CV will be permanently deleted.
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={e => {
                handleButtonClick(e);
                handleDeleteCV();
              }}
              disabled={deleteCVMutation.isPending}
              className="w-full"
            >
              {deleteCVMutation.isPending ? 'Deleting...' : 'Delete CV'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
