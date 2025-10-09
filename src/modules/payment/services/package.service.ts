import { baseClient } from '@/shared/utils/api-client.util';
import { PACKAGE_ENDPOINTS } from '../constants/payment-endpoint.constant';
import type { Package } from '../types/payment.types';

/**
 * Get all active packages
 */
export const getActivePackages = async (): Promise<Package[]> => {
  const { data } = await baseClient<Package[]>({
    method: 'GET',
    url: PACKAGE_ENDPOINTS.GET_ACTIVE_PACKAGES,
  });
  return data;
};

/**
 * Get package by ID
 */
export const getPackageById = async (id: string): Promise<Package> => {
  const { data } = await baseClient<Package>({
    method: 'GET',
    url: PACKAGE_ENDPOINTS.GET_PACKAGE_BY_ID(id),
  });
  return data;
};

/**
 * Get package by name
 */
export const getPackageByName = async (name: string): Promise<Package> => {
  const { data } = await baseClient<Package>({
    method: 'GET',
    url: PACKAGE_ENDPOINTS.GET_PACKAGE_BY_NAME(name),
  });
  return data;
};
