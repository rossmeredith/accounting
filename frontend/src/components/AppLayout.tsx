import {
  Box,
  Container,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navLinkStyle = {
  textDecoration: 'none' as const,
  color: 'var(--mantine-color-brand-7)',
  fontWeight: 500,
};

const navButtonStyle = {
  ...navLinkStyle,
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer' as const,
  font: 'inherit' as const,
};

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <Box mih="100vh">
      <Box component="header" className="accounting-app-header" py="md">
        <Container fluid px="lg">
          <Group justify="space-between" wrap="nowrap">
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
            <Group gap="lg" wrap="nowrap">
              {user ? (
                <>
                  <Text size="sm" c="dimmed">
                    {user.email}
                  </Text>
                  <Menu position="bottom-start" withinPortal width="target">
                    <Menu.Target>
                      <UnstyledButton
                        style={navButtonStyle}
                        aria-label="Nominal ledger menu"
                      >
                        <Group gap={4} wrap="nowrap">
                          <Text span size="sm" c="brand.7" fw={500}>
                            Nominal ledger
                          </Text>
                          <IconChevronDown size={14} stroke={2.5} />
                        </Group>
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown miw={220}>
                      <Menu.Item component={Link} to="/nominal-ledger">
                        List
                      </Menu.Item>
                      <Menu.Item component={Link} to="/nominal-ledger/create">
                        Create
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                  <Text
                    component={Link}
                    to="/account"
                    size="sm"
                    style={navLinkStyle}
                  >
                    Account
                  </Text>
                  <Text
                    component="button"
                    type="button"
                    size="sm"
                    style={navButtonStyle}
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
                    style={navLinkStyle}
                  >
                    Sign in
                  </Text>
                  <Text
                    component={Link}
                    to="/register"
                    size="sm"
                    style={navLinkStyle}
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
