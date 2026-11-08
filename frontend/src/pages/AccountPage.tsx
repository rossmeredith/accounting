import { useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ApiError } from '../api/client';
import { changePassword } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export function AccountPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (newPassword !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage(result.detail);
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Password change failed.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack gap="md">
      <Title order={2}>Account</Title>
      {user && (
        <Text c="dimmed" size="sm">
          {user.email}
        </Text>
      )}
      <Stack gap="md" component="form" onSubmit={handleSubmit}>
        <Title order={4}>Change password</Title>
        {error && (
          <Alert color="red" title="Update failed">
            {error}
          </Alert>
        )}
        {message && (
          <Alert color="green" title="Password updated">
            {message}
          </Alert>
        )}
        <PasswordInput
          label="Current password"
          name="current_password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.currentTarget.value)}
          required
        />
        <PasswordInput
          label="New password"
          name="new_password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
          required
        />
        <PasswordInput
          label="Confirm new password"
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.currentTarget.value)}
          required
        />
        <Button type="submit" loading={submitting}>
          Update password
        </Button>
      </Stack>
    </Stack>
  );
}
