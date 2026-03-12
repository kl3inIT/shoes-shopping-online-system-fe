import type { ApiSuccessResponse } from '@/types';

export interface User {
  keycloakId: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  address: string | null;
  lastSeenAt: string | null;
}

export type UserResponseDto = ApiSuccessResponse<User>;

export interface UpdateUserProfilePayload {
  phoneNumber?: string | null;
  dateOfBirth?: string | null; // ISO date: YYYY-MM-DD
  avatarUrl?: string | null;
  address?: string | null;
}
