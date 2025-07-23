import { authClient } from '@/modules/auth/services/client.service';
import type { UserResponse } from '../types/auth.type';
import { UPDATE_PROFILE_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';
import { UPDATE_AVATAR_ENDPOINT } from '@/modules/cv/constants/cv-endpoint.constant';
/**
 * Update avatar for the current user
 * @param file Avatar file to upload
 * @returns Updated user response
 */
export async function updateAvatar(file: File): Promise<UserResponse> {
  const formData = new FormData();
  formData.append('File', file);

  const { data } = await authClient<UserResponse>({
    method: 'PUT',
    url: UPDATE_AVATAR_ENDPOINT,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return data;
}

type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
};

export async function updateProfile(payload: UpdateProfileRequest): Promise<UserResponse> {
  const { data } = await authClient<UserResponse>({
    method: 'PUT',
    url: UPDATE_PROFILE_ENDPOINT,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  return data;
}
