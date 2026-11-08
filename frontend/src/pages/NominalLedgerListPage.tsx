import { useCallback, useEffect, useState } from 'react';
import { Alert, Anchor, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ApiError } from '../api/client';
import { fetchNominalAccounts } from '../api/nominal';
import { AppContentPanel } from '../components/AppContentPanel';
import { NominalAccountsDataTable } from '../components/NominalAccountsDataTable';
import type { NominalAccount } from '../types/nominal';

export function NominalLedgerListPage() {
  const [accounts, setAccounts] = useState<NominalAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const data = await fetchNominalAccounts();
      setAccounts(data);
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : 'Could not load accounts.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  return (
    <AppContentPanel containerSize="xl">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={2}>Nominal ledger</Title>
          <Text c="dimmed" size="sm">
            Hierarchical chart of accounts. Codes are unique by full path (e.g.{' '}
            <code>1000/1100</code>), not globally.
          </Text>
          <Text size="sm">
            <Anchor component={Link} to="/nominal-ledger/create">
              Add a nominal account
            </Anchor>
          </Text>
        </Stack>

        {loadError && (
          <Alert color="red" title="Load failed">
            {loadError}
          </Alert>
        )}

        {loading ? (
          <Text c="dimmed">Loading…</Text>
        ) : accounts.length === 0 ? (
          <Text c="dimmed" size="sm">
            No nominal accounts yet.
          </Text>
        ) : (
          <NominalAccountsDataTable accounts={accounts} />
        )}
      </Stack>
    </AppContentPanel>
  );
}
