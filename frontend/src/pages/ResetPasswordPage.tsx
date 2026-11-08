import { useMemo, useState, type FormEvent } from 'react';
import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core';
import { Link, useSearchParams } from 'react-router-dom';
import { ApiError } from '../api/client';
import { confirmPasswordReset } from '../api/auth';
import { AuthenticationPageShell } from '../components/AuthenticationPageShell';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid') ?? '';
  const token = searchParams.get('token') ?? '';

  const linkValid = useMemo(
    () => uid.length > 0 && token.length > 0,
    [uid, token],
  );

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await confirmPasswordReset({
        uid,
        token,
        new_password: password,
      });
      setMessage(result.detail);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Reset failed.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!linkValid) {
    return (
      <AuthenticationPageShell
        title="Reset password"
        subtitle={
          <Anchor component={Link} to="/forgot-password" size="sm">
            Request a new reset link
          </Anchor>
        }
      >
        <Alert color="red" title="Invalid link">
          This reset link is missing required parameters. Request a new link
          from the forgot-password page.
        </Alert>
      </AuthenticationPageShell>
    );
  }

  return (
    <AuthenticationPageShell
      title="Choose a new password"
      subtitle={
        <>
          <Anchor component={Link} to="/login" size="sm">
            Back to sign in
          </Anchor>
        </>
      }
    >
      <Stack gap="md" component="form" onSubmit={handleSubmit}>
        <Text c="dimmed" size="sm">
          Enter a new password for your account.
        </Text>
        {error && (
          <Alert color="red" title="Reset failed">
            {error}
          </Alert>
        )}
        {message && (
          <Alert color="green" title="Password updated">
            {message}{' '}
            <Anchor component={Link} to="/login" size="sm">
              Sign in
            </Anchor>
          </Alert>
        )}
        <PasswordInput
          label="New password"
          name="password"
          autoComplete="new-password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <PasswordInput
          label="Confirm password"
          name="confirm"
          autoComplete="new-password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.currentTarget.value)}
          required
        />
        <Button type="submit" fullWidth mt="md" loading={submitting}>
          Update password
        </Button>
      </Stack>
    </AuthenticationPageShell>
  );
}
