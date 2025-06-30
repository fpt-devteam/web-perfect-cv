import { useQuery } from '@tanstack/react-query';
import { getContact } from '@/modules/cv/services/cv-section.service';
const genGetContactKey = (cvId: string) => ['contact', cvId];
export function useGetContact({ cvId }: { readonly cvId: string }) {
  return useQuery({
    queryKey: genGetContactKey(cvId),
    queryFn: () => getContact({ cvId }),
  });
}
