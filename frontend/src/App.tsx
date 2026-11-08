import { useEffect, useState } from 'react';
import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { fetchHealth } from './api/client';

function App() {
  const [apiStatus, setApiStatus] = useState<string>('…');

  useEffect(() => {
    fetchHealth()
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'));
  }, []);

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Title order={1}>Accounting</Title>
        <Text c="dimmed">
          Django Ninja at <code>/api/</code> · Vite + React (TypeScript) +
          Mantine
        </Text>
        <Text>Backend health: {apiStatus}</Text>
        <Button>Mantine button</Button>
      </Stack>
    </Container>
  );
}

export default App;
