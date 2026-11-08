import type { ReactNode } from 'react';
import { Container, Paper, Title } from '@mantine/core';
import classes from './authentication-page-shell.module.css';

type AuthenticationPageShellProps = {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

/** Mantine UI “authentication-title” layout: heading above a bordered card. */
export function AuthenticationPageShell({
  title,
  subtitle,
  children,
}: AuthenticationPageShellProps) {
  return (
    <Container size={420} my={40}>
      <Title order={2} ta="center" className={classes.title}>
        {title}
      </Title>
      {subtitle ? <div className={classes.subtitle}>{subtitle}</div> : null}
      <Paper withBorder shadow="sm" p={22} mt={30} bg="white">
        {children}
      </Paper>
    </Container>
  );
}
