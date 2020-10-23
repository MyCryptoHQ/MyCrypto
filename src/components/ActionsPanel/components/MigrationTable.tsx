import React, { useContext } from 'react';

import { getAccountBalance, getAccountsByAsset, StoreContext, useAssets } from '@services';
import { Asset, TUuid } from '@types';

import { ActionTable } from './ActionTable';

export const MigrationTable = ({ assetUuid }: { assetUuid: TUuid }) => {
  const { accounts } = useContext(StoreContext);
  const { getAssetByUUID } = useAssets();

  const asset = (getAssetByUUID(assetUuid) || {}) as Asset;

  const relevantAccounts = getAccountsByAsset(accounts, asset);

  const tableAccounts = relevantAccounts.map((account) => {
    return { address: account.address, amount: getAccountBalance(account, asset).toString() };
  });

  return <ActionTable accounts={tableAccounts} asset={asset} />;
};
