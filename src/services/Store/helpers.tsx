import { TOKEN_MIGRATIONS } from '@config';
import { Asset, ITxReceipt, ITxStatus, ITxType, StoreAccount, StoreAsset, TUuid } from '@types';
import { bigify, convertToFiatFromAsset } from '@utils';

import { getTotalByAsset } from './Asset';

export const getTxsFromAccount = (accounts: StoreAccount[]): ITxReceipt[] => {
  return accounts
    .filter(Boolean)
    .flatMap(({ transactions: txs }: { transactions: ITxReceipt[] }) => txs);
};

export const txIsPending = ({ status }: { status: ITxStatus }) => status === ITxStatus.PENDING;
export const txIsSuccessful = ({ status }: { status: ITxStatus }) => status === ITxStatus.SUCCESS;
export const txIsFailed = ({ status }: { status: ITxStatus }) => status === ITxStatus.FAILED;

export const isNotExcludedAsset = (excludedAssetUuids: TUuid[]) => (asset: StoreAsset): boolean =>
  !(excludedAssetUuids || []).includes(asset.uuid);

export const isExcludedAsset = (excludedAssetUuids: TUuid[]) => (asset: StoreAsset): boolean =>
  (excludedAssetUuids || []).includes(asset.uuid);

export const isTokenMigration = (type: ITxType) => TOKEN_MIGRATIONS.includes(type);

export const getAccountsAssets = (accounts: StoreAccount[]) => accounts.flatMap((a) => a.assets);

export const calculateTotals = (accounts: StoreAccount[]) =>
  Object.values(getTotalByAsset(getAccountsAssets(accounts)));

export const calculateTotalFiat = (accounts: StoreAccount[]) => (
  getAssetRate: (asset: Asset) => number | undefined
) =>
  calculateTotals(accounts).reduce(
    (sum, asset) => sum.plus(bigify(convertToFiatFromAsset(asset, getAssetRate(asset)))),
    bigify(0)
  );
