import type { HealthResponse } from '../types/api';

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { headers: defaultHeaders });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export function fetchHealth(): Promise<HealthResponse> {
  return getJson<HealthResponse>('/api/health');
}
