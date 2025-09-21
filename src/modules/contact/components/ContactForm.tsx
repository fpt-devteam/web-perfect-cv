import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, Github as GithubIcon, Globe, MapPin } from 'lucide-react';
import { LinkedinLogo } from '@phosphor-icons/react';
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
import type { UpSertContactRequest } from '@/modules/contact/types/contact.types';

const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

const contactSchema = z.object({
  phoneNumber: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      val => {
        if (!val || val === '') return true;
        const cleanNumber = val.replace(/[\s()-]/g, '');
        return cleanNumber.length >= 7 && cleanNumber.length <= 15;
      },
      {
        message: 'Phone number must be between 7-15 digits',
      }
    )
    .refine(
      val => {
        if (!val || val === '') return true;
        return phoneRegex.test(val);
      },
      {
        message: 'Invalid phone number format. Use digits, spaces, dashes, or parentheses only',
      }
    ),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  linkedInUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  gitHubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  personalWebsiteUrl: z.string().url('Invalid website URL').optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  initialData?: Partial<ContactFormValues>;
  onSubmit: (data: UpSertContactRequest) => void;
  isLoading?: boolean;
  cvId: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  cvId,
}) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phoneNumber: initialData?.phoneNumber || '',
      email: initialData?.email || '',
      linkedInUrl: initialData?.linkedInUrl || '',
      gitHubUrl: initialData?.gitHubUrl || '',
      personalWebsiteUrl: initialData?.personalWebsiteUrl || '',
      city: initialData?.city || '',
      country: initialData?.country || '',
    },
  });

  const handleSubmit = (data: ContactFormValues) => {
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

    onSubmit(processedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Input placeholder="e.g. +1 (555) 123-4567 or 555-123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting || isLoading} className="min-w-32">
            {form.formState.isSubmitting && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {isLoading ? 'Loading' : 'Save Contact Info'}
          </Button>
        </div>
      </form>
    </Form>
  );
};