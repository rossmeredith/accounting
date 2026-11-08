import type { ReactNode } from 'react';
import { Container, Paper } from '@mantine/core';

type AppContentPanelProps = {
  children: ReactNode;
};

/** Bordered work area for signed-in app screens (non-auth). */
export function AppContentPanel({ children }: AppContentPanelProps) {
  return (
    <Container size="sm" py="xl">
      <Paper p="xl" bg="white">
        {children}
      </Paper>
    </Container>
  );
}
