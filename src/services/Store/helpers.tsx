import { DEFAULT_ASSET_DECIMAL, TOKEN_MIGRATIONS } from '@config';
import { generateGenericBase } from '@features/SendAssets';
import { ITxMetaTypes } from '@store/txHistory.slice';
import { Asset, IFullTxHistoryValueTransfer, ITxReceipt, ITxStatus, ITxType, Network, StoreAccount, StoreAsset, TAddress, TUuid } from '@types';
import { bigify, convertToFiatFromAsset, fromTokenBase, generateDeterministicAddressUUID } from '@utils';

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

export const handleBaseAssetTransfer = (
  valueTransfers: IFullTxHistoryValueTransfer[],
  value: string,
  toAddr: TAddress,
  fromAddr: TAddress,
  baseAsset: Asset
): IFullTxHistoryValueTransfer[] => 
  (valueTransfers.length == 0 && !bigify(value).isZero())
    ? [...valueTransfers, {
      asset: baseAsset,
      to: toAddr,
      from: fromAddr,
      amount: fromTokenBase(bigify(value), DEFAULT_ASSET_DECIMAL).toString()
    }] : valueTransfers

// Improves verbosity of internal-transaction base value transfers.
// Only used for incomplete EXCHANGE transaction types (i.e - swapping ERC20 -> ETH)
export const handleIncExchangeTransaction = (
  valueTransfers: IFullTxHistoryValueTransfer[],
  txTypeMetas: ITxMetaTypes,
  accountsMap: Record<string, boolean>,
  derivedTxType: string,
  toAddr: TAddress,
  fromAddr: TAddress,
  network: Network
): IFullTxHistoryValueTransfer[] => 
  (txTypeMetas[derivedTxType]
  && txTypeMetas[derivedTxType].type == 'EXCHANGE'
  && (valueTransfers.filter((t) => accountsMap[generateDeterministicAddressUUID(network.id, t.to)]) || []).length == 0)
    ? valueTransfers = [...valueTransfers, {
      asset: generateGenericBase(network.chainId.toString(), network.id),
      to: toAddr,
      from: fromAddr,
      amount: undefined
    }] : valueTransfers;