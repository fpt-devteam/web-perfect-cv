import { useQuery } from '@tanstack/react-query';
import { getActivePackages, getPackageById, getPackageByName } from '../services/package.service';

/**
 * Hook to get all active packages
 */
export const useActivePackages = () => {
  return useQuery({
    queryKey: ['packages', 'active'],
    queryFn: getActivePackages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a package by ID
 */
export const usePackageById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['package', id],
    queryFn: () => getPackageById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a package by name
 */
export const usePackageByName = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['package', 'name', name],
    queryFn: () => getPackageByName(name),
    enabled: enabled && !!name,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
