import type { CVContact, UpSertContactRequest } from '@/modules/contact/types/contact.types';
import { LIST_CONTACTS_ENDPOINT, UPSERT_CONTACT_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';
import { authClient } from '@/modules/auth/services/client.service';

export const listContacts = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVContact>({
    method: 'GET',
    url: LIST_CONTACTS_ENDPOINT(cvId),
  });
  return data;
};

export const upsertContact = async ({
  cvId,
  contactData,
}: {
  readonly cvId: string;
  readonly contactData: UpSertContactRequest;
}) => {
  const { data } = await authClient<CVContact>({
    method: 'POST',
    url: UPSERT_CONTACT_ENDPOINT(cvId),
    data: contactData,
  });
  return data;
};