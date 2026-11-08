import { apiRequest } from './client';
import type {
  CreateNominalAccountInput,
  NominalAccount,
} from '../types/nominal';

export function fetchNominalAccounts(): Promise<NominalAccount[]> {
  return apiRequest<NominalAccount[]>('/api/nominal-ledger/accounts');
}

export function createNominalAccount(
  data: CreateNominalAccountInput,
): Promise<NominalAccount> {
  return apiRequest<NominalAccount>('/api/nominal-ledger/accounts', {
    method: 'POST',
    body: data,
  });
}
