import { bigNumberify } from 'ethers/utils';

import { translateRaw } from '@translations';
import {
  Asset,
  AssetBalanceObject,
  ExtendedContact,
  IAccount,
  IPendingTxReceipt,
  ITxReceipt,
  ITxStatus,
  ITxType,
  Network,
  StoreAccount,
  StoreAsset,
  TUuid
} from '@types';

import { getLabelByAccount } from './Contact';
import { getNetworkById } from './Network';

const getAssetsByUuid = (accountAssets: AssetBalanceObject[], assets: Asset[]): StoreAsset[] =>
  accountAssets
    .map((asset) => {
      const refAsset = assets.find((a) => a.uuid === asset.uuid)!;
      return {
        ...refAsset,
        ...asset
      };
    })
    .map((asset) => ({ ...asset, balance: bigNumberify(asset.balance), mtime: Date.now() }));

export const getStoreAccounts = (
  accounts: IAccount[],
  assets: Asset[],
  networks: Network[],
  contacts: ExtendedContact[]
): StoreAccount[] => {
  return accounts.map((a) => {
    const accountLabel = getLabelByAccount(a, contacts);
    return {
      ...a,
      assets: getAssetsByUuid(a.assets, assets),
      network: getNetworkById(a.networkId, networks),
      label: accountLabel ? accountLabel.label : translateRaw('NO_LABEL')
    };
  });
};

export const txIsPending = ({ status }: { status: ITxStatus }) => status === ITxStatus.PENDING;
export const txIsSuccessful = ({ status }: { status: ITxStatus }) => status === ITxStatus.SUCCESS;
export const txIsFailed = ({ status }: { status: ITxStatus }) => status === ITxStatus.FAILED;

export const getTxsFromAccount = (accounts: StoreAccount[]): ITxReceipt[] => {
  return accounts
    .filter(Boolean)
    .flatMap(({ transactions: txs }: { transactions: ITxReceipt[] }) =>
      txs.map((tx: any) => ({ ...tx, status: tx.status || tx.stage }))
    );
};

export const getPendingTransactionsFromAccounts = (accounts: StoreAccount[]): IPendingTxReceipt[] =>
  getTxsFromAccount(accounts).filter(txIsPending) as IPendingTxReceipt[];

export const isNotExcludedAsset = (excludedAssetUuids: TUuid[]) => (asset: StoreAsset): boolean =>
  !(excludedAssetUuids || []).includes(asset.uuid);

export const isExcludedAsset = (excludedAssetUuids: TUuid[]) => (asset: StoreAsset): boolean =>
  (excludedAssetUuids || []).includes(asset.uuid);

const TOKEN_MIGRATIONS = [
  ITxType.REP_TOKEN_MIGRATION,
  ITxType.AAVE_TOKEN_MIGRATION,
  ITxType.ANT_TOKEN_MIGRATION
];

export const isTokenMigration = (type: ITxType) => type in TOKEN_MIGRATIONS;
