import axios from 'axios';
import { API_ENDPOINT } from '@/config/env.config';

export function createBaseClient(baseURL = API_ENDPOINT) {
  const client = axios.create({
    baseURL,
    paramsSerializer: {
      indexes: null, // by default: false
    },
  });

  return client;
}

export const baseClient = createBaseClient();
