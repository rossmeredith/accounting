import { Box, Container, Group, Text } from '@mantine/core';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <Box mih="100vh">
      <Box component="header" className="accounting-app-header" py="md">
        <Container size="sm">
          <Group justify="space-between">
            <Text
              component={Link}
              to="/"
              fw={600}
              size="lg"
              style={{
                textDecoration: 'none',
                color: 'var(--accounting-text)',
                fontFamily: 'var(--mantine-font-family-headings)',
              }}
            >
              Accounting
            </Text>
            <Group gap="md">
              {user ? (
                <>
                  <Text size="sm" c="dimmed">
                    {user.email}
                  </Text>
                  <Text
                    component={Link}
                    to="/account"
                    size="sm"
                    c="brand.7"
                    fw={500}
                  >
                    Account
                  </Text>
                  <Text
                    component="button"
                    type="button"
                    size="sm"
                    c="brand.7"
                    fw={500}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      font: 'inherit',
                    }}
                    onClick={() => {
                      void logout();
                    }}
                  >
                    Sign out
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    component={Link}
                    to="/login"
                    size="sm"
                    c="brand.7"
                    fw={500}
                  >
                    Sign in
                  </Text>
                  <Text
                    component={Link}
                    to="/register"
                    size="sm"
                    c="brand.7"
                    fw={500}
                  >
                    Register
                  </Text>
                </>
              )}
            </Group>
          </Group>
        </Container>
      </Box>
      <Outlet />
    </Box>
  );
}
