type RequiredEnvKey = 'VITE_OIDC_AUTHORITY' | 'VITE_OIDC_CLIENT_ID';

function readEnv(key: keyof ImportMetaEnv) {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

function readRequiredEnv(key: RequiredEnvKey) {
  const value = readEnv(key);

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function normalizeUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export const appEnv = {
  oidcAuthority: readRequiredEnv('VITE_OIDC_AUTHORITY'),
  oidcClientId: readRequiredEnv('VITE_OIDC_CLIENT_ID'),
  apiBaseUrl: normalizeUrl(
    readEnv('VITE_API_BASE_URL') || 'http://localhost:8088'
  ),
  isDevelopment: import.meta.env.DEV,
} as const;
