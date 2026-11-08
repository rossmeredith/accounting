import { useState, type FormEvent } from 'react';
import { Alert, Anchor, Button, Stack, Text, TextInput } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ApiError } from '../api/client';
import { requestPasswordReset } from '../api/auth';
import { AuthenticationPageShell } from '../components/AuthenticationPageShell';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email.trim());
      setMessage(result.detail);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Request failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthenticationPageShell
      title="Forgot password"
      subtitle={
        <>
          Remember your password?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Back to sign in
          </Anchor>
        </>
      }
    >
      <Stack gap="md" component="form" onSubmit={handleSubmit}>
        <Text c="dimmed" size="sm">
          Enter your email and we&apos;ll send a reset link when an account
          exists.
        </Text>
        {error && (
          <Alert color="red" title="Request failed">
            {error}
          </Alert>
        )}
        {message && (
          <Alert color="green" title="Check your email">
            {message}
          </Alert>
        )}
        <TextInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <Button type="submit" fullWidth mt="md" loading={submitting}>
          Send reset link
        </Button>
      </Stack>
    </AuthenticationPageShell>
  );
}
