import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, Github as GithubIcon, Globe, MapPin } from 'lucide-react';
import { LinkedinLogo } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useNotification } from '@/shared/hooks/useNotification';
import { useListContacts, useUpsertContact } from '@/modules/cv/hooks/useContacts';
import type { UpSertContactRequest } from '@/modules/cv/types/cv.types';
import type { BaseError } from '@/shared/types/error.type';
import type { AxiosError } from 'axios';

const contactSchema = z.object({
  phoneNumber: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  linkedInUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  gitHubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  personalWebsiteUrl: z.string().url('Invalid website URL').optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface CVContactFormProps {
  cvId: string;
  onSuccess?: () => void;
}

export const CVContactForm: React.FC<CVContactFormProps> = ({ cvId, onSuccess }) => {
  const { showError, showSuccess } = useNotification();
  const { data: contactData, isLoading: isLoadingContacts } = useListContacts({ cvId });
  const [isLoading, setIsLoading] = React.useState(false);
  const upsertContact = useUpsertContact({ cvId });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phoneNumber: '',
      email: '',
      linkedInUrl: '',
      gitHubUrl: '',
      personalWebsiteUrl: '',
      city: '',
      country: '',
    },
  });

  useEffect(() => {
    console.log('useEffect triggered:', { isLoadingContacts, contactCV: contactData });
    if (!isLoadingContacts && contactData) {
      form.reset({
        phoneNumber: contactData.phoneNumber ?? '',
        email: contactData.email ?? '',
        linkedInUrl: contactData.linkedInUrl ?? '',
        gitHubUrl: contactData.gitHubUrl ?? '',
        personalWebsiteUrl: contactData.personalWebsiteUrl ?? '',
        city: contactData.city ?? '',
        country: contactData.country ?? '',
      });
      console.log('Form values after reset:', form.getValues());
    }
  }, [contactData, isLoadingContacts, form]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const processedData: UpSertContactRequest = {
        cvId,
        phoneNumber: !data.phoneNumber || data.phoneNumber === '' ? null : data.phoneNumber,
        email: !data.email || data.email === '' ? null : data.email,
        linkedInUrl: !data.linkedInUrl || data.linkedInUrl === '' ? null : data.linkedInUrl,
        gitHubUrl: !data.gitHubUrl || data.gitHubUrl === '' ? null : data.gitHubUrl,
        personalWebsiteUrl:
          !data.personalWebsiteUrl || data.personalWebsiteUrl === ''
            ? null
            : data.personalWebsiteUrl,
        city: !data.city || data.city === '' ? null : data.city,
        country: !data.country || data.country === '' ? null : data.country,
      };

      console.log('Processed Data:', processedData);

      await upsertContact.mutateAsync(processedData, {
        onSuccess: () => {
          showSuccess('Login successful');
        },
        onError: error => {
          showError(error as AxiosError<BaseError>);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });

      showSuccess('Contact updated successfully!');
      onSuccess?.();
    } catch {
      showError('Failed to update contact');
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

  return (
    <div className="space-y-6">
      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Your Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* LinkedIn URL */}
                <FormField
                  control={form.control}
                  name="linkedInUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <LinkedinLogo className="h-4 w-4" />
                        LinkedIn Profile
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/johndoe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* GitHub URL */}
                <FormField
                  control={form.control}
                  name="gitHubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <GithubIcon className="h-4 w-4" />
                        GitHub Profile
                      </FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://github.com/johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Personal Website */}
                <FormField
                  control={form.control}
                  name="personalWebsiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Personal Website
                      </FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://johndoe.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        City
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-32">
                  {form.formState.isSubmitting && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {isLoading ? 'Loading' : 'Save Contact Info'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
