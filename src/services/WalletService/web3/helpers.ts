import { IExposedAccountsPermission, IWeb3Permission } from '@types';

export const deriveApprovedAccounts = (walletPermissions: IWeb3Permission[] | undefined) => {
  if (!walletPermissions) return;
  const exposedAccounts = walletPermissions.find(
    (caveat: any) => caveat.name === 'exposedAccounts'
  ) as IExposedAccountsPermission | undefined;
  return exposedAccounts && exposedAccounts.value;
};
