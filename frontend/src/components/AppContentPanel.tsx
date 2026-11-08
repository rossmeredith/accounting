import type { ReactNode } from 'react';
import { Container, Paper, type MantineSize } from '@mantine/core';

type AppContentPanelProps = {
  children: ReactNode;
  containerSize?: MantineSize | (string & {}) | number;
};

/** Bordered work area for signed-in app screens (non-auth). */
export function AppContentPanel({
  children,
  containerSize = 'sm',
}: AppContentPanelProps) {
  return (
    <Container size={containerSize} py="xl">
      <Paper p="xl" bg="white">
        {children}
      </Paper>
    </Container>
  );
}
