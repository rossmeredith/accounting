import { apiRequest } from './client';
import type { MessageResponse, User } from '../types/auth';

export function fetchCurrentUser(): Promise<User> {
  return apiRequest<User>('/api/auth/me');
}

export function registerUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  return apiRequest<User>('/api/auth/register', {
    method: 'POST',
    body: input,
  });
}

export function loginUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  return apiRequest<User>('/api/auth/login', { method: 'POST', body: input });
}

export function logoutUser(): Promise<MessageResponse> {
  return apiRequest<MessageResponse>('/api/auth/logout', { method: 'POST' });
}

export function changePassword(input: {
  current_password: string;
  new_password: string;
}): Promise<MessageResponse> {
  return apiRequest<MessageResponse>('/api/auth/password/change', {
    method: 'POST',
    body: input,
  });
}

export function requestPasswordReset(email: string): Promise<MessageResponse> {
  return apiRequest<MessageResponse>('/api/auth/password/reset', {
    method: 'POST',
    body: { email },
  });
}

export function confirmPasswordReset(input: {
  uid: string;
  token: string;
  new_password: string;
}): Promise<MessageResponse> {
  return apiRequest<MessageResponse>('/api/auth/password/reset/confirm', {
    method: 'POST',
    body: input,
  });
}
