import axios from 'axios';
import { AI_API_ENDPOINT } from '@/config/env.config';

export function createAIClient(baseURL = AI_API_ENDPOINT) {
  const client = axios.create({
    baseURL,
    paramsSerializer: {
      indexes: null, // by default: false
    },
  });

  return client;
}

export const aiClient = createAIClient();
