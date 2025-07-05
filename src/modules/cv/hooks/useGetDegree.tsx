import { useQuery } from '@tanstack/react-query';
import { GET_DEGREE_ENDPOINT } from '../constants/cv-endpoint.constant';
import { getDegrees } from '../services/search.service';

const genDegreeKey = () => ['degree', GET_DEGREE_ENDPOINT];

export function useGetDegree(options = {}) {
  return useQuery({
    queryKey: genDegreeKey(),
    queryFn: () => getDegrees(),
    ...options,
  });
}
