export type NominalAccountType =
  'asset' | 'liability' | 'equity' | 'income' | 'expense';

export type NominalStatementClass = 'balance_sheet' | 'profit_or_loss';

export type NominalAccount = {
  id: number;
  parent_id: number | null;
  code: string;
  code_path: string;
  name: string;
  account_type: NominalAccountType;
  statement_class: NominalStatementClass;
  tags: string[];
  is_active: boolean;
};

export type CreateNominalAccountInput = {
  parent_id?: number | null;
  code: string;
  name: string;
  account_type: NominalAccountType;
  tags?: string[];
};

export type NominalAccountTreeRow = NominalAccount & {
  subRows?: NominalAccountTreeRow[];
};
