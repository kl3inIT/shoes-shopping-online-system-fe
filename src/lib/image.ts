import apiClient from '@/features/apiClient';

/**
 * Backend serves files via GET /api/files/** (see FileController.java)
 * Backend returns object keys like: "shoes/xxx.png" or "shoevariants/yyy.png"
 * Full URL should be: {baseURL}/api/files/{objectKey}
 */
const FILES_PREFIX = '/api/files/';

function joinUrl(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  // Already absolute or data/blob
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const baseURL = apiClient.defaults.baseURL ?? '';
  const objectKey = url.startsWith('/') ? url.slice(1) : url;

  return joinUrl(baseURL, `${FILES_PREFIX}${objectKey}`);
}

export function resolveImageUrls(
  urls?: Array<string | null | undefined>
): string[] {
  return (urls ?? [])
    .map((u) => resolveImageUrl(u))
    .filter((u): u is string => Boolean(u));
}
