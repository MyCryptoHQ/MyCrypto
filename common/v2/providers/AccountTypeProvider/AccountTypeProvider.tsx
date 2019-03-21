import AccountTypeServiceBase from 'v2/services/AccountType/AccountType';
import { AccountType, ExtendedAccountType } from 'v2/services/AccountType';
import { serviceProvider } from 'v2/providers/serviceProvider';

export interface ProviderState {
  accountTypes: ExtendedAccountType[];
  createAccountType(accountTypeData: ExtendedAccountType): void;
  readAccountType(uuid: string): AccountType;
  deleteAccountType(uuid: string): void;
  updateAccountType(uuid: string, accountTypeData: ExtendedAccountType): void;
}

export const AccountTypeProvider = serviceProvider(new AccountTypeServiceBase());
