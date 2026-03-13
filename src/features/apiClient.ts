import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  getAccessToken as getAccessTokenFromProvider,
  getIsAuthReady,
} from './auth/accessTokenProvider';
import { HttpError, type ProblemDetailPayload } from './HttpError';
import { i18n } from '@/i18n';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const API_BASE_URL = getBaseURL();

function getBaseURL(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return 'http://localhost:8088';
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const isDev = import.meta.env.DEV;

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth) {
      return config;
    }
    if (getIsAuthReady()) {
      try {
        const token = await getAccessTokenFromProvider();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // silently proceed without token
      }
    }

    // ==== QUAN TRỌNG: xử lý Content-Type ====
    const isFormData = config.data instanceof FormData;

    if (!config.headers) {
      config.headers = axios.defaults.headers
        .common as InternalAxiosRequestConfig['headers'];
    }

    if (isFormData) {
      if ('Content-Type' in config.headers) {
        delete (config.headers as Record<string, unknown>)['Content-Type'];
      }
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    config.headers['Accept-Language'] = i18n.language?.split('-')[0] ?? 'en';

    if (isDev) {
      (config as unknown as { _metadata?: { startTime: number } })._metadata = {
        startTime: Date.now(),
      };
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ProblemDetailPayload>) => {
    if (isDev) {
      console.error('[API Response Error]', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
      });
    }

    if (!error.response) {
      const isTimeout =
        error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      const messageKey = isTimeout
        ? 'http.error.timeout'
        : 'http.error.network';
      const noResponseError = new HttpError(error.config, 0, {
        detail: i18n.t(messageKey),
        messageKey,
      });
      return Promise.reject(noResponseError);
    }

    const { status = 0, data } = error.response;
    const problemDetail = (data ?? {}) as ProblemDetailPayload;

    switch (status) {
      case 401: {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (originalRequest._retry) {
          console.warn(
            '[API Client] Token refresh failed or already retried. Redirecting to login.'
          );
          return Promise.reject(
            new HttpError(error.config, 401, {
              ...problemDetail,
              messageKey: problemDetail.messageKey ?? 'http.error.401',
            })
          );
        }

        originalRequest._retry = true;

        try {
          if (isDev) {
            console.log(
              '[API Client] 401 received, attempting to get fresh token...'
            );
          }
          const freshToken = await getAccessTokenFromProvider();

          if (freshToken) {
            originalRequest.headers.Authorization = `Bearer ${freshToken}`;

            if (isDev) {
              console.log(
                '[API Client] Fresh token obtained, retrying request...'
              );
            }

            return apiClient(originalRequest);
          } else {
            console.warn('[API Client] No token available');
            return Promise.reject(
              new HttpError(error.config, 401, {
                ...problemDetail,
                messageKey: problemDetail.messageKey ?? 'http.error.401',
              })
            );
          }
        } catch (tokenError) {
          console.error('[API Client] Failed to get fresh token:', tokenError);
          return Promise.reject(
            new HttpError(error.config, 401, {
              ...problemDetail,
              messageKey: problemDetail.messageKey ?? 'http.error.401',
            })
          );
        }
      }

      default:
        // Các lỗi còn lại: trả về HttpError bọc ProblemDetail từ backend
        return Promise.reject(
          new HttpError(error.config, status, problemDetail)
        );
    }
  }
);

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export function isNoResponseError(error: unknown): boolean {
  return isHttpError(error) && error.status === 0;
}

export function getErrorMessage(error: unknown): string {
  if (isHttpError(error)) {
    return error.userMessage();
  }
  if (error instanceof Error) {
    return error.message;
  }
  return i18n.t('http.error.unknown', 'Đã xảy ra lỗi, vui lòng thử lại');
}

export default apiClient;
