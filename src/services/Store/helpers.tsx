import { bigNumberify } from 'ethers/utils/bignumber';

import {
  Network,
  AssetBalanceObject,
  Asset,
  StoreAsset,
  IAccount,
  StoreAccount,
  ITxStatus,
  ITxReceipt,
  ExtendedAddressBook
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

export const txIsPending = ({ stage }: { stage: ITxStatus }) => stage === ITxStatus.PENDING;
export const txIsSuccessful = ({ stage }: { stage: ITxStatus }) => stage === ITxStatus.SUCCESS;
export const txIsFailed = ({ stage }: { stage: ITxStatus }) => stage === ITxStatus.FAILED;

export const getTxsFromAccount = (accounts: StoreAccount[]): ITxReceipt[] => {
  return accounts
    .filter(Boolean)
    .flatMap(({ transactions: txs, network }: { transactions: any; network: any }) =>
      txs.map((tx: any) => ({ ...tx, network }))
    );
};

export const getPendingTransactionsFromAccounts = (accounts: StoreAccount[]): ITxReceipt[] =>
  getTxsFromAccount(accounts).filter(txIsPending);
