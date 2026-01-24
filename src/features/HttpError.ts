import type { AxiosRequestConfig } from 'axios';
import { i18n } from '@/i18n';

export interface ProblemDetailPayload {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  messageKey?: string;
  params?: Record<string, unknown>;
  errors?: Record<string, string>;
}

export class HttpError extends Error {
  public readonly request?: AxiosRequestConfig;
  public readonly status: number;
  public readonly details?: string;
  public readonly title?: string;
  public readonly instance?: string;
  public readonly messageKey?: string;
  public readonly params?: Record<string, unknown>;
  public readonly errors?: Record<string, string>;

  constructor(
    request: AxiosRequestConfig | undefined,
    status: number,
    payload: ProblemDetailPayload = {}
  ) {
    const effectiveStatus = status ?? payload.status ?? 0;
    super(payload.detail || payload.title || `HTTP ${effectiveStatus}`);
    this.name = 'HttpError';
    this.request = request;
    this.status = effectiveStatus;
    this.details = payload.detail;
    this.title = payload.title;
    this.instance = payload.instance;
    this.messageKey = payload.messageKey;
    this.params = payload.params;
    this.errors = payload.errors;

    Object.setPrototypeOf(this, HttpError.prototype);
  }

  isHard(): boolean {
    return this.status === 401 || this.status >= 500;
  }

  isRetryable(): boolean {
    return [0, 429, 502, 503, 504].includes(this.status);
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }

  i18nKey(): string {
    if (this.messageKey) {
      return this.messageKey;
    }

    if (this.status === 0) {
      return 'http.error.network';
    }

    return `http.error.${this.status}`;
  }

  userMessage(): string {
    if (this.details) {
      return this.details;
    }

    const key = this.i18nKey();

    const translated = i18n.t(key, {
      defaultValue: '',
      ...(this.params ?? {}),
    });

    if (translated) {
      return translated;
    }

    return i18n.t('http.error.unknown', 'Đã xảy ra lỗi, vui lòng thử lại');
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
      title: this.title,
      instance: this.instance,
      messageKey: this.messageKey,
      params: this.params,
      errors: this.errors,
      url: this.request?.url,
      method: this.request?.method,
    };
  }
}
