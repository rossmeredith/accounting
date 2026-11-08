import type { NominalAccount, NominalAccountTreeRow } from '../types/nominal';

export function buildNominalTree(
  accounts: NominalAccount[],
): NominalAccountTreeRow[] {
  const nodes = new Map<number, NominalAccountTreeRow>();
  for (const account of accounts) {
    nodes.set(account.id, { ...account, subRows: [] });
  }
  const roots: NominalAccountTreeRow[] = [];
  for (const account of accounts) {
    const node = nodes.get(account.id);
    if (!node) continue;
    if (account.parent_id == null) {
      roots.push(node);
      continue;
    }
    const parent = nodes.get(account.parent_id);
    if (parent) {
      parent.subRows = parent.subRows ?? [];
      parent.subRows.push(node);
    } else {
      roots.push(node);
    }
  }
  const pruneAndSort = (rows: NominalAccountTreeRow[]) => {
    rows.sort((a, b) => a.code_path.localeCompare(b.code_path));
    for (const row of rows) {
      if (row.subRows?.length) {
        pruneAndSort(row.subRows);
      } else {
        delete row.subRows;
      }
    }
  };
  pruneAndSort(roots);
  return roots;
}
