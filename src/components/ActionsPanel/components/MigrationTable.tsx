import { getAccountBalance, getAccountsByAsset, useAssets } from '@services';
import { getStoreAccounts, useSelector } from '@store';
import { Asset, TUuid } from '@types';

import { ActionTable } from './ActionTable';

export const MigrationTable = ({ assetUuid }: { assetUuid: TUuid }) => {
  const accounts = useSelector(getStoreAccounts);
  const { getAssetByUUID } = useAssets();

  const asset = (getAssetByUUID(assetUuid) ?? {}) as Asset;

  const relevantAccounts = getAccountsByAsset(accounts, asset);

  const tableAccounts = relevantAccounts.map((account) => {
    return { address: account.address, amount: getAccountBalance(account, asset).toString() };
  });

  return <ActionTable accounts={tableAccounts} asset={asset} />;
};
