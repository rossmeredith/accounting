import { useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  ScrollArea,
  Table,
  Text,
} from '@mantine/core';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
} from '@tanstack/react-table';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { buildNominalTree } from '../nominal/buildTree';
import { formatAccountType, formatStatementClass } from '../nominal/display';
import type { NominalAccount, NominalAccountTreeRow } from '../types/nominal';

type NominalAccountsDataTableProps = {
  accounts: NominalAccount[];
};

function isGroupRow(row: NominalAccountTreeRow): boolean {
  return Boolean(row.subRows?.length);
}

export function NominalAccountsDataTable({
  accounts,
}: NominalAccountsDataTableProps) {
  const treeData = useMemo(() => buildNominalTree(accounts), [accounts]);
  const [expanded, setExpanded] = useState<ExpandedState>(true);

  const columns = useMemo<ColumnDef<NominalAccountTreeRow>[]>(
    () => [
      {
        id: 'account',
        header: 'Account',
        cell: ({ row }) => {
          const depthPad = row.depth * 20;
          const group = isGroupRow(row.original);
          return (
            <Group gap="xs" wrap="nowrap" align="flex-start">
              {row.getCanExpand() ? (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  aria-label={row.getIsExpanded() ? 'Collapse' : 'Expand'}
                  onClick={row.getToggleExpandedHandler()}
                >
                  {row.getIsExpanded() ? (
                    <IconChevronDown size={14} />
                  ) : (
                    <IconChevronRight size={14} />
                  )}
                </ActionIcon>
              ) : (
                <Box w={28} miw={28} />
              )}
              <Box style={{ paddingLeft: depthPad }}>
                <Text size="sm" fw={group ? 600 : 400}>
                  {row.original.name}
                </Text>
                <Text size="xs" c="dimmed" className="tabular-nums">
                  {row.original.code}
                  {row.original.code_path !== row.original.code
                    ? ` · ${row.original.code_path}`
                    : ''}
                </Text>
              </Box>
            </Group>
          );
        },
      },
      {
        accessorKey: 'statement_class',
        header: 'Classification',
        cell: ({ getValue }) => (
          <Text size="sm">
            {formatStatementClass(
              getValue<NominalAccount['statement_class']>(),
            )}
          </Text>
        ),
      },
      {
        accessorKey: 'account_type',
        header: 'Type',
        cell: ({ row, getValue }) =>
          row.depth === 0 ? (
            <Text size="sm" fw={500}>
              {formatAccountType(getValue<NominalAccount['account_type']>())}
            </Text>
          ) : (
            <Text size="sm" c="dimmed">
              {formatAccountType(getValue<NominalAccount['account_type']>())}
            </Text>
          ),
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ getValue }) => {
          const tags = getValue<string[]>();
          if (!tags.length) {
            return (
              <Text size="sm" c="dimmed">
                —
              </Text>
            );
          }
          return (
            <Group gap={6}>
              {tags.map((tag) => (
                <Badge key={tag} size="sm" variant="outline">
                  {tag}
                </Badge>
              ))}
            </Group>
          );
        },
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge
            size="sm"
            variant="light"
            color={getValue<boolean>() ? 'green' : 'gray'}
          >
            {getValue<boolean>() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: treeData,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <ScrollArea.Autosize mah="70vh" type="auto">
      <Table
        striped
        highlightOnHover
        withTableBorder
        verticalSpacing="sm"
        layout="fixed"
      >
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th
                  key={header.id}
                  w={header.id === 'account' ? '45%' : undefined}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr
              key={row.id}
              style={
                isGroupRow(row.original) && row.depth === 0
                  ? { backgroundColor: 'var(--accounting-canvas)' }
                  : undefined
              }
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id} valign="top">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea.Autosize>
  );
}
