import { useState } from 'react';
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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { useNotification } from '@/shared/hooks/useNotification';
import { useUpdateCV, useDeleteCV } from '@/modules/cv/hooks';
import type { CVResponse } from '@/modules/cv/types/cv.types';

const updateCVSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
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

  const form = useForm<UpdateCVFormValues>({
    resolver: zodResolver(updateCVSchema),
    defaultValues: {
      title: cv.title,
    },
  });

  const handleUpdateCV = async (data: UpdateCVFormValues) => {
    console.log('handleUpdateCV called with:', data);
    try {
      await updateCVMutation.mutateAsync({
        cvId: cv.cvId,
        request: data,
      });
      showSuccess('CV title updated successfully');
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error('Update CV error:', error);
      showError('Failed to update CV title');
    }
  };

  const handleDeleteCV = async () => {
    try {
      await deleteCVMutation.mutateAsync({
        cvId: cv.cvId,
      });
      showSuccess('CV deleted successfully');
      setIsOpen(false);
    } catch (error) {
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
          {/* Edit CV Title Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Edit CV Title</h3>
            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter CV title"
                          disabled={updateCVMutation.isPending}
                          onClick={handleInputClick}
                          onFocus={handleInputClick}
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
                    disabled={updateCVMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      console.log('Update button clicked');
                      const formData = form.getValues();
                      console.log('Form data:', formData);
                      if (formData.title && formData.title.trim()) {
                        handleUpdateCV(formData);
                      } else {
                        showError('Please enter a valid title');
                      }
                    }}
                    disabled={updateCVMutation.isPending}
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
