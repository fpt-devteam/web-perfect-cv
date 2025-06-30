import { authClient } from '@/modules/auth/services/client.service';
import type { CVResponse } from '@/modules/cv/types/cv.types';
import { GET_CONTACT_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';

export const getContact = async ({ cvId }: { readonly cvId: string }) => {
  const { data } = await authClient<CVResponse>({
    method: 'GET',
    url: GET_CONTACT_ENDPOINT(cvId),
  });
  return data;
};
