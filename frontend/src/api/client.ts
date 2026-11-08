import type { MessageResponse } from '../types/auth';
import type { HealthResponse } from '../types/api';

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function ensureCsrfCookie(): Promise<void> {
  if (getCsrfToken()) {
    return;
  }
  await fetch('/api/auth/csrf', {
    credentials: 'include',
    headers: defaultHeaders,
  });
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      detail?: string;
      message?: string;
    };
    if (data.detail) {
      return data.detail;
    }
    if (data.message) {
      return data.message;
    }
  } catch {
    // fall through
  }
  return response.statusText || 'Request failed';
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  skipCsrf?: boolean;
};

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, skipCsrf = false }: RequestOptions = {},
): Promise<T> {
  if (!skipCsrf && method !== 'GET') {
    await ensureCsrfCookie();
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  const csrf = getCsrfToken();
  if (csrf && method !== 'GET') {
    headers['X-CSRFToken'] = csrf;
  }

  const response = await fetch(path, {
    method,
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function fetchHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/api/health');
}

export function fetchMessage(
  path: string,
  options: Omit<RequestOptions, 'skipCsrf'> = {},
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>(path, options);
}
