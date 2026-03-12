import apiClient from '../apiClient';
import type { UpdateUserProfilePayload, User, UserResponseDto } from './types';

export async function getUserById(id: string): Promise<User> {
  const response = await apiClient.get<UserResponseDto>(`/user/${id}`);
  return response.data.data;
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<UserResponseDto>(`/users/me`);
  return response.data.data;
}

export async function updateMyProfile(
  payload: UpdateUserProfilePayload
): Promise<User> {
  const response = await apiClient.patch<UserResponseDto>(`/users/me`, payload);
  return response.data.data;
}

export async function uploadMyAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<UserResponseDto>(
    `/users/me/avatar`,
    formData
  );
  return response.data.data;
}
