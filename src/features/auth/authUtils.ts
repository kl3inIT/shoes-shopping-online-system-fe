import { User } from 'oidc-client-ts';
import { client_id, authority } from '@/features/auth/oidcConfig';

export function getUserFromStorage(): User | null {
  const storageKey = `oidc.user:${authority}:${client_id}`;

  const oidcStorage = localStorage.getItem(storageKey);

  if (!oidcStorage) {
    return null;
  }

  try {
    return User.fromStorageString(oidcStorage);
  } catch (error) {
    console.error('[Auth] Failed to parse user from storage:', error);
    return null;
  }
}

export function getAccessToken(): string | null {
  const user = getUserFromStorage();
  return user?.access_token || null;
}

export function isTokenExpired(): boolean {
  const user = getUserFromStorage();
  if (!user) return true;

  return user.expired || false;
}
