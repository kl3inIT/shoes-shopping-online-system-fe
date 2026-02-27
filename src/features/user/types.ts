import type { ApiSuccessResponse } from '@/types';

export interface User {
  keycloakId: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  lastSeenAt: string | null;
}

export type UserResponseDto = ApiSuccessResponse<User>;
