export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';

export interface Customer {
  id: string;
  user: {
    id: string;
    keycloakId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    avatarUrl: string;
    role: UserRole;
    status: UserStatus;
    lastSeenAt: string;
    createdAt: string;
  };
  defaultShippingName: string;
  defaultShippingPhone: string;
  defaultShippingAddress: string;
  totalOrders: number;
  totalSpent: number;
  reviewCount: number;
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      keycloakId: 'kc-001',
      username: 'nguyenvana',
      email: 'nguyenvana@gmail.com',
      firstName: 'Van A',
      lastName: 'Nguyen',
      phoneNumber: '0901234567',
      dateOfBirth: '1990-05-15',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana',
      role: 'ROLE_USER',
      status: 'ACTIVE',
      lastSeenAt: '2024-01-23T10:30:00Z',
      createdAt: '2023-06-15T08:00:00Z',
    },
    defaultShippingName: 'Nguyen Van A',
    defaultShippingPhone: '0901234567',
    defaultShippingAddress: '123 Nguyen Hue, District 1, Ho Chi Minh City',
    totalOrders: 12,
    totalSpent: 2450,
    reviewCount: 8,
  },
  {
    id: '2',
    user: {
      id: 'u2',
      keycloakId: 'kc-002',
      username: 'tranthib',
      email: 'tranthib@gmail.com',
      firstName: 'Thi B',
      lastName: 'Tran',
      phoneNumber: '0912345678',
      dateOfBirth: '1995-08-20',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tranthib',
      role: 'ROLE_USER',
      status: 'ACTIVE',
      lastSeenAt: '2024-01-22T15:00:00Z',
      createdAt: '2023-09-10T12:00:00Z',
    },
    defaultShippingName: 'Tran Thi B',
    defaultShippingPhone: '0912345678',
    defaultShippingAddress: '456 Le Loi, District 3, Ho Chi Minh City',
    totalOrders: 5,
    totalSpent: 890,
    reviewCount: 3,
  },
  {
    id: '3',
    user: {
      id: 'u3',
      keycloakId: 'kc-003',
      username: 'levanc',
      email: 'levanc@gmail.com',
      firstName: 'Van C',
      lastName: 'Le',
      phoneNumber: '0923456789',
      dateOfBirth: '1988-12-01',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=levanc',
      role: 'ROLE_USER',
      status: 'INACTIVE',
      lastSeenAt: '2024-01-10T09:00:00Z',
      createdAt: '2023-03-22T14:00:00Z',
    },
    defaultShippingName: 'Le Van C',
    defaultShippingPhone: '0923456789',
    defaultShippingAddress: '789 Hai Ba Trung, District 1, Ho Chi Minh City',
    totalOrders: 3,
    totalSpent: 520,
    reviewCount: 2,
  },
  {
    id: '4',
    user: {
      id: 'u4',
      keycloakId: 'kc-004',
      username: 'phamthid',
      email: 'phamthid@gmail.com',
      firstName: 'Thi D',
      lastName: 'Pham',
      phoneNumber: '0934567890',
      dateOfBirth: '1992-03-10',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=phamthid',
      role: 'ROLE_USER',
      status: 'ACTIVE',
      lastSeenAt: '2024-01-23T08:00:00Z',
      createdAt: '2023-11-05T10:00:00Z',
    },
    defaultShippingName: 'Pham Thi D',
    defaultShippingPhone: '0934567890',
    defaultShippingAddress: '321 Vo Van Tan, District 3, Ho Chi Minh City',
    totalOrders: 8,
    totalSpent: 1680,
    reviewCount: 6,
  },
  {
    id: '5',
    user: {
      id: 'u5',
      keycloakId: 'kc-005',
      username: 'hoangvane',
      email: 'hoangvane@gmail.com',
      firstName: 'Van E',
      lastName: 'Hoang',
      phoneNumber: '0945678901',
      dateOfBirth: '1985-07-25',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoangvane',
      role: 'ROLE_USER',
      status: 'BANNED',
      lastSeenAt: '2024-01-05T16:00:00Z',
      createdAt: '2023-01-15T09:00:00Z',
    },
    defaultShippingName: 'Hoang Van E',
    defaultShippingPhone: '0945678901',
    defaultShippingAddress: '654 Nguyen Trai, District 5, Ho Chi Minh City',
    totalOrders: 2,
    totalSpent: 300,
    reviewCount: 0,
  },
];

export const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'BANNED', label: 'Banned' },
];
