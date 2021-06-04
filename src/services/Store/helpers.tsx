import { TOKEN_MIGRATIONS } from '@config';
import { ITxReceipt, ITxStatus, ITxType, StoreAccount, StoreAsset, TUuid } from '@types';

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
