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

const getBaseURL = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return 'http://localhost:8088';
};

const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth) {
      return config;
    }
    if (getIsAuthReady()) {
      try {
        const token = await getAccessTokenFromProvider();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn(
          '[API Client] Failed to get access token, proceeding without token:',
          error
        );
      }
    } else {
      console.log(
        `[API Client] Auth not ready, proceeding without token for ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    (config as unknown as { _metadata?: { startTime: number } })._metadata = {
      startTime: Date.now(),
    };

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as unknown as {
      _metadata?: { startTime?: number };
    };
    const duration = config._metadata?.startTime
      ? Date.now() - config._metadata.startTime
      : undefined;

    console.log(
      `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`,
      {
        status: response.status,
        duration: duration ? `${duration}ms` : undefined,
        data: response.data,
      }
    );

    return response;
  },
  async (error: AxiosError<ProblemDetailPayload>) => {
    console.error('[API Response Error]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });

    if (!error.response) {
      const networkError = new HttpError(error.config, 0, {
        detail: i18n.t('http.error.network', 'Không thể kết nối tới máy chủ'),
        messageKey: 'http.error.network',
      });
      return Promise.reject(networkError);
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
          console.log(
            '[API Client] 401 received, attempting to get fresh token...'
          );
          const freshToken = await getAccessTokenFromProvider();

          if (freshToken) {
            originalRequest.headers.Authorization = `Bearer ${freshToken}`;

            console.log(
              '[API Client] Fresh token obtained, retrying request...'
            );

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
