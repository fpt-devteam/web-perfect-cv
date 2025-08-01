import { useQuery } from '@tanstack/react-query';
import { GET_EMPLOYMENT_TYPE_ENDPOINT } from '../constants/cv-endpoint.constant';
import { getEmploymentTypes } from '../services/search.service';

const genEmploymentTypeKey = () => ['employmentType', GET_EMPLOYMENT_TYPE_ENDPOINT];

export function useGetEmploymentType(options = {}) {
  return useQuery({
    queryKey: genEmploymentTypeKey(),
    queryFn: () => getEmploymentTypes(),
    ...options,
  });
}
