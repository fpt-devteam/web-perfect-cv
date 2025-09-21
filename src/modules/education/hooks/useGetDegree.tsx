import { useQuery } from '@tanstack/react-query';
import { GET_DEGREE_ENDPOINT } from '../constants/education-endpoint.constant';
import { getDegrees } from '../services/education.services';

const genDegreeKey = () => ['degree', GET_DEGREE_ENDPOINT];

export function useGetDegree(options = {}) {
  return useQuery({
    queryKey: genDegreeKey(),
    queryFn: () => getDegrees(),
    ...options,
  });
}