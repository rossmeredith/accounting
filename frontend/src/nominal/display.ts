import type {
  NominalAccountType,
  NominalStatementClass,
} from '../types/nominal';

export const ACCOUNT_TYPE_OPTIONS: {
  value: NominalAccountType;
  label: string;
}[] = [
  { value: 'asset', label: 'Asset' },
  { value: 'liability', label: 'Liability' },
  { value: 'equity', label: 'Equity' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export function formatAccountType(type: NominalAccountType): string {
  return ACCOUNT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

const STATEMENT_CLASS_LABELS: Record<NominalStatementClass, string> = {
  balance_sheet: 'Balance sheet',
  profit_or_loss: 'Profit or loss',
};

export function formatStatementClass(value: NominalStatementClass): string {
  return STATEMENT_CLASS_LABELS[value] ?? value;
}

/** Section headings for the nominal list (balance sheet → P&L order). */
export const ACCOUNT_TYPE_SECTION_LABELS: Record<NominalAccountType, string> = {
  asset: 'Assets',
  liability: 'Liabilities',
  equity: 'Equity',
  income: 'Income',
  expense: 'Expenses',
};

export const ACCOUNT_TYPE_SECTION_ORDER: NominalAccountType[] =
  ACCOUNT_TYPE_OPTIONS.map((o) => o.value);

export function groupNominalAccountsByType<
  T extends { account_type: NominalAccountType; code: string },
>(accounts: T[]): Map<NominalAccountType, T[]> {
  const grouped = new Map<NominalAccountType, T[]>();
  for (const type of ACCOUNT_TYPE_SECTION_ORDER) {
    grouped.set(type, []);
  }
  for (const account of accounts) {
    const bucket = grouped.get(account.account_type);
    if (bucket) {
      bucket.push(account);
    }
  }
  for (const [, bucket] of grouped) {
    bucket.sort((a, b) => a.code.localeCompare(b.code));
  }
  return grouped;
}
