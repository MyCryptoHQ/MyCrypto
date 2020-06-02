import { bigNumberify } from 'ethers/utils';

import {
  Network,
  AssetBalanceObject,
  Asset,
  StoreAsset,
  IAccount,
  StoreAccount,
  ITxStatus,
  ITxReceipt,
  ExtendedAddressBook,
  IPendingTxReceipt
} from '@types';

import { getLabelByAccount } from './AddressBook';
import { getNetworkById } from './Network';
import { translateRaw } from '@translations';

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
  contacts: ExtendedAddressBook[]
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
    .flatMap(({ transactions: txs, network }: { transactions: ITxReceipt[]; network: any }) =>
      txs.map((tx: any) => ({ ...tx, status: tx.status || tx.stage, network }))
    );
};

export const getPendingTransactionsFromAccounts = (accounts: StoreAccount[]): IPendingTxReceipt[] =>
  getTxsFromAccount(accounts).filter(txIsPending) as IPendingTxReceipt[];
