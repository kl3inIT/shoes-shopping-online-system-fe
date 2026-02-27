import apiClient from '../apiClient';
import type { User, UserResponseDto } from './types';

export async function getUserById(id: string): Promise<User> {
  const response = await apiClient.get<UserResponseDto>(`/user/${id}`);
  return response.data.data;
}

export async function getCurrentUser(id: string): Promise<User> {
  return getUserById(id);
}
