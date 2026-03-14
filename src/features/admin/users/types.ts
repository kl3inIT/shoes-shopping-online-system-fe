export type UserRole =
  | 'ROLE_ADMIN'
  | 'ROLE_MANAGER'
  | 'ROLE_CUSTOMER'
  | 'ROLE_SEPAY_WEBHOOK';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AdminUser {
  id: string;
  keycloakId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  address: string | null;
  role: UserRole;
  status: UserStatus;
  lastSeenAt: string | null;
  createdAt: string;
}

export interface AdminUserPageResponse {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface GetAdminUsersParams {
  page?: number;
  size?: number;
  search?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
}

export interface CreateAdminUserPayload {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'ROLE_MANAGER' | 'ROLE_ADMIN';
}
