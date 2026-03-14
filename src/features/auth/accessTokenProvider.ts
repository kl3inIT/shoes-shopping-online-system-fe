import {
  getAccessToken as getStoredAccessToken,
  isTokenExpired,
} from './authUtils';

type AccessTokenResolver = () => Promise<string>;

let resolveAccessToken: AccessTokenResolver | undefined;
let isAuthReady = false;

export function registerAccessToken(resolver: AccessTokenResolver): void {
  resolveAccessToken = resolver;
  isAuthReady = true;
}

export function unregisterAccessToken(): void {
  resolveAccessToken = undefined;
  isAuthReady = false;
}

export function getIsAuthReady(): boolean {
  return isAuthReady || (!!getStoredAccessToken() && !isTokenExpired());
}

export async function getAccessToken(): Promise<string> {
  if (resolveAccessToken) {
    return resolveAccessToken();
  }

  const storedAccessToken = getStoredAccessToken();

  if (storedAccessToken && !isTokenExpired()) {
    return storedAccessToken;
  }

  throw new Error('Access token resolver has not been registered');
}
