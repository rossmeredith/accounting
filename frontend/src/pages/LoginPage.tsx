import { useState, type FormEvent } from 'react';
import {
  Alert,
  Anchor,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { AuthenticationPageShell } from '../components/AuthenticationPageShell';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthenticationPageShell
      title="Welcome back!"
      subtitle={
        <>
          Do not have an account yet?{' '}
          <Anchor component={Link} to="/register" size="sm">
            Create account
          </Anchor>
        </>
      }
    >
      <Stack gap="md" component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert color="red" title="Could not sign in">
            {error}
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
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <Group justify="flex-end" mt="xs">
          <Anchor component={Link} to="/forgot-password" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button type="submit" fullWidth mt="md" loading={submitting}>
          Sign in
        </Button>
      </Stack>
    </AuthenticationPageShell>
  );
}
