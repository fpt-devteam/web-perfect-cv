import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useNotification } from '@/shared/hooks/useNotification';
import { useListContacts, useUpsertContact } from '@/modules/contact/hooks/useContacts';
import { ContactForm } from './ContactForm';
import type { UpSertContactRequest } from '@/modules/contact/types/contact.types';
import type { BaseError } from '@/shared/types/error.type';
import type { AxiosError } from 'axios';

interface CVContactSectionProps {
  cvId: string;
  onSuccess?: () => void;
}

export const CVContactSection: React.FC<CVContactSectionProps> = ({ cvId, onSuccess }) => {
  const { showError, showSuccess } = useNotification();
  const { data: contactData, isLoading: isLoadingContacts } = useListContacts({ cvId });
  const [isLoading, setIsLoading] = useState(false);
  const upsertContact = useUpsertContact({ cvId });

  const handleSubmit = async (data: UpSertContactRequest) => {
    setIsLoading(true);

    try {
      await upsertContact.mutateAsync(data, {
        onSuccess: () => {
          showSuccess('Contact updated successfully!');
          onSuccess?.();
        },
        onError: error => {
          showError(error as AxiosError<BaseError>);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } catch {
      showError('Failed to update contact');
      setIsLoading(false);
    }
  };

  if (isLoadingContacts) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse text-sm text-muted-foreground">Loading contacts...</div>
        </CardContent>
      </Card>
    );
  }

  const initialData = contactData ? {
    phoneNumber: contactData.phoneNumber ?? '',
    email: contactData.email ?? '',
    linkedInUrl: contactData.linkedInUrl ?? '',
    gitHubUrl: contactData.gitHubUrl ?? '',
    personalWebsiteUrl: contactData.personalWebsiteUrl ?? '',
    city: contactData.city ?? '',
    country: contactData.country ?? '',
  } : {};

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <ContactForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            cvId={cvId}
          />
        </CardContent>
      </Card>
    </div>
  );
};