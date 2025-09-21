import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listContacts, upsertContact } from '@/modules/contact/services/contact.services';
import type { UpSertContactRequest } from '@/modules/contact/types/contact.types';

const genContactsKey = (cvId: string) => ['contacts', cvId];

export function useListContacts({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genContactsKey(cvId),
    queryFn: () => listContacts({ cvId }),
    enabled: !!cvId,
  });
}

export function useUpsertContact({ cvId }: { readonly cvId: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactData: UpSertContactRequest) => upsertContact({ cvId, contactData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: genContactsKey(cvId) });
    },
  });
}