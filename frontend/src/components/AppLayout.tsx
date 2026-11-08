import { Anchor, Container, Group, Text } from '@mantine/core';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <Container size="sm" py="xl">
      <Group justify="space-between" mb="lg">
        <Anchor component={Link} to="/" underline="never" c="inherit">
          <Text fw={700} size="lg">
            Accounting
          </Text>
        </Anchor>
        <Group gap="md">
          {user ? (
            <>
              <Text size="sm" c="dimmed">
                {user.email}
              </Text>
              <Anchor component={Link} to="/account" size="sm">
                Account
              </Anchor>
              <Anchor
                component="button"
                type="button"
                size="sm"
                onClick={() => {
                  void logout();
                }}
              >
                Sign out
              </Anchor>
            </>
          ) : (
            <>
              <Anchor component={Link} to="/login" size="sm">
                Sign in
              </Anchor>
              <Anchor component={Link} to="/register" size="sm">
                Register
              </Anchor>
            </>
          )}
        </Group>
      </Group>
      <Outlet />
    </Container>
  );
}
