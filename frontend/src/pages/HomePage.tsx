import { useEffect, useState } from 'react';
import { Stack, Text, Title } from '@mantine/core';
import { fetchHealth } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { user } = useAuth();
  const [apiStatus, setApiStatus] = useState('…');

  useEffect(() => {
    fetchHealth()
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'));
  }, []);

  return (
    <Stack gap="md">
      <Title order={1}>Home</Title>
      <Text c="dimmed">
        Django Ninja at <code>/api/</code> with session auth and CSRF.
      </Text>
      <Text>Backend health: {apiStatus}</Text>
      {user ? (
        <Text>
          Signed in as <strong>{user.email}</strong>
        </Text>
      ) : (
        <Text c="dimmed">You are not signed in.</Text>
      )}
    </Stack>
  );
}
