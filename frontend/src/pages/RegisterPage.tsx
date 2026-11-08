import { useState, type FormEvent } from 'react';
import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { AuthenticationPageShell } from '../components/AuthenticationPageShell';
import { useAuth } from '../contexts/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthenticationPageShell
      title="Create an account"
      subtitle={
        <>
          Already have an account?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Sign in
          </Anchor>
        </>
      }
    >
      <Stack gap="md" component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert color="red" title="Could not register">
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
          autoComplete="new-password"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
        />
        <Button type="submit" fullWidth mt="md" loading={submitting}>
          Create account
        </Button>
      </Stack>
    </AuthenticationPageShell>
  );
}
