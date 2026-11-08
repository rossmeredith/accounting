import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Select,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { createNominalAccount, fetchNominalAccounts } from '../api/nominal';
import { AppContentPanel } from '../components/AppContentPanel';
import { ACCOUNT_TYPE_OPTIONS, formatAccountType } from '../nominal/display';
import type { NominalAccount, NominalAccountType } from '../types/nominal';

export function NominalLedgerCreatePage() {
  const navigate = useNavigate();
  const [parents, setParents] = useState<NominalAccount[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [accountType, setAccountType] = useState<NominalAccountType | null>(
    'expense',
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNominalAccounts()
      .then(setParents)
      .catch(() => setParents([]));
  }, []);

  const selectedParent = useMemo(
    () => parents.find((p) => String(p.id) === parentId) ?? null,
    [parents, parentId],
  );

  useEffect(() => {
    if (selectedParent) {
      setAccountType(selectedParent.account_type);
    }
  }, [selectedParent]);

  const parentOptions = parents.map((p) => ({
    value: String(p.id),
    label: `${p.code_path} — ${p.name}`,
  }));

  const typeLocked = selectedParent !== null;

  function handleParentChange(value: string | null) {
    setParentId(value);
    if (value) {
      const parent = parents.find((p) => String(p.id) === value);
      if (parent) {
        setAccountType(parent.account_type);
      }
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!accountType) {
      setFormError('Account type is required.');
      return;
    }
    setSubmitting(true);
    try {
      await createNominalAccount({
        parent_id: parentId ? Number(parentId) : null,
        code,
        name,
        account_type: accountType,
        tags,
      });
      navigate('/nominal-ledger');
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Could not create account.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppContentPanel containerSize="md">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={2}>Create nominal account</Title>
          <Text c="dimmed" size="sm">
            Choosing a parent fixes the account type to match that branch of the
            chart. Top-level accounts can use any type.
          </Text>
        </Stack>

        <Stack gap="md" component="form" onSubmit={handleSubmit}>
          {formError && (
            <Alert color="red" title="Create failed">
              {formError}
            </Alert>
          )}
          <Select
            label="Parent account"
            name="parent_id"
            placeholder="Top level (no parent)"
            clearable
            searchable
            data={parentOptions}
            value={parentId}
            onChange={handleParentChange}
          />
          <TextInput
            label="Code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
            placeholder="e.g. 1100"
            description="Segment only — not the full path. Slashes are not allowed."
            required
          />
          <TextInput
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="e.g. Consulting income"
            required
          />
          <Select
            label="Type"
            name="account_type"
            data={ACCOUNT_TYPE_OPTIONS}
            value={accountType}
            onChange={(value) =>
              setAccountType((value as NominalAccountType) ?? null)
            }
            disabled={typeLocked}
            description={
              typeLocked && accountType
                ? `Inherited from parent (${formatAccountType(accountType)}).`
                : undefined
            }
            required
          />
          <TagsInput
            label="Tags"
            name="tags"
            placeholder="Add labels"
            value={tags}
            onChange={setTags}
          />
          <Button type="submit" loading={submitting}>
            Add account
          </Button>
        </Stack>
      </Stack>
    </AppContentPanel>
  );
}
