import { useState, type FormEvent } from 'react';
import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
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
    <Stack gap="md" component="form" onSubmit={handleSubmit}>
      <Title order={2}>Register</Title>
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
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
      />
      <PasswordInput
        label="Password"
        name="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
      />
      <Button type="submit" loading={submitting}>
        Create account
      </Button>
      <Anchor component={Link} to="/login" size="sm">
        Already have an account? Sign in
      </Anchor>
    </Stack>
  );
}
