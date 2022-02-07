import { deriveTxType, getAssetByContractAndNetworkId, ITxHistoryEntry } from '@services';
import {
  Asset,
  AssetBalanceObject,
  ExtendedAsset,
  ExtendedContact,
  ExtendedContract,
  ExtendedNotification,
  IAccount,
  IFullTxHistoryValueTransfer,
  IProvidersMappings,
  IRates,
  ITxReceipt,
  Network,
  NodeOptions,
  StoreAccount,
  StoreAsset,
  TAddress,
  TTicker
} from '@types';
import { addBaseAssetValueTransfer, bigify, deriveDisplayAsset, generateDeterministicAddressUUID, generateGenericBase, isBigish, isVoid } from '@utils';
import {
  either,
  identity,
  ifElse,
  isNil,
  lensPath,
  lensProp,
  map,
  mapObjIndexed,
  mergeRight,
  over,
  pipe,
  toString
} from '@vendor';

import { getContactByAddressAndNetworkId } from '../Contact/helpers';
import { ITxMetaTypes } from './txHistory.slice';

const balanceLens = lensProp('balance');
const txValueLens = lensProp('value');
const assetLens = lensProp('assets');
const transactionsLens = lensProp('transactions');

const stringifyBigish = ifElse(isBigish, toString, identity);
export const stringifyBalance = over(balanceLens, stringifyBigish);
export const stringifyValue = over(txValueLens, toString);
export const bigifyBalnce = over(balanceLens, bigify);

/**
 * input may be Date, undefined or string.
 * Convert to ISO 8601 when Date.
 */
export const stringifyDate = ifElse(
  either(isNil, (d) => typeof d === 'string'),
  identity,
  (d) => d.toISOString()
);

export const serializeAccount: (a: IAccount | StoreAccount) => IAccount | StoreAccount = pipe(
  over(assetLens, map(stringifyBalance)),
  over(transactionsLens, map(mapObjIndexed(stringifyBigish)))
);

export const serializeNotification: (n: ExtendedNotification) => ExtendedNotification = (n) => {
  return pipe(
    over(lensProp('dateDisplayed'), stringifyDate),
    over(lensProp('dateDismissed'), stringifyDate),
    over(lensPath(['templateData', 'firstDashboardVisitDate']), stringifyDate),
    over(lensPath(['templateData', 'previousNotificationCloseDate']), stringifyDate)
  )(n);
};

const mergeNodes = (inbound: NodeOptions[], original: NodeOptions[]) =>
  original
    .map((o) => {
      const existing = inbound.find((i) => i.name === o.name);
      return mergeRight(o, existing ?? {});
    })
    .concat(inbound.filter((i) => i.isCustom));

export const mergeNetworks = (inbound: Network[], original: Network[]) =>
  original
    .map((o) => {
      const existing = inbound.find((i) => i.id === o.id);
      const existingNodes = existing ? existing.nodes : [];
      const selectedNode = existing ? existing.selectedNode : o.selectedNode;

      return {
        ...o,
        nodes: mergeNodes(existingNodes, o.nodes),
        selectedNode
      } as Network;
    })
    .concat(inbound.filter((i) => !original.find((o) => o.id === i.id)));

export const mergeAssets = (inbound: ExtendedAsset[], original: ExtendedAsset[]) =>
  original
    .map((o) => {
      const existing = inbound.find((i) => i.uuid === o.uuid);
      return mergeRight(o, existing ?? {});
    })
    .concat(inbound.filter((i) => !original.find((o) => o.uuid === i.uuid)));

export const destructureCoinGeckoIds = (
  rates: IRates,
  coinGeckoIdMapping: Record<string, string>
): IRates => {
  // From: { ["ethereum"]: { "usd": 123.45,"eur": 234.56 } }
  // To: { [uuid for coinGeckoId "ethereum"]: { "usd": 123.45, "eur": 234.56 } }
  const updateRateObj = (acc: IRates, curValue: TTicker): IRates =>
    Object.entries(coinGeckoIdMapping).reduce((accum, [assetUuid, coinGeckoId]) => {
      if (coinGeckoId === curValue) {
        accum[assetUuid] = rates[curValue];
      }
      return accum;
    }, acc);

  return Object.keys(rates).reduce(updateRateObj, {} as IRates);
};

export const buildCoinGeckoIdMapping = (assets: Record<string, IProvidersMappings | undefined>) =>
  Object.keys(assets).reduce((acc, a) => {
    if (!isVoid(assets[a]) && assets[a]?.coinGeckoId) {
      return { ...acc, [a]: assets[a]!.coinGeckoId! };
    }
    return acc;
  }, {} as Record<string, string>);

// Ensure that we don't push unnecessary data to the store
export const sanitizeAccount = (a: IAccount) => ({
  uuid: a.uuid,
  label: a.label,
  address: a.address,
  networkId: a.networkId,
  assets: a.assets?.map((a: AssetBalanceObject | StoreAsset) => ({
    uuid: a.uuid,
    balance: a.balance
  })),
  wallet: a.wallet,
  transactions: a.transactions,
  path: a.path,
  index: a.index,
  mtime: a.mtime,
  favorite: a.favorite,
  isPrivate: a.isPrivate
});

export const generateCustomDPath = (dPath: string) => {
  const dPathArray = dPath.split('/');
  const index = parseInt(dPathArray.pop()!, 10);
  const path = {
    name: 'Custom DPath',
    path: `${dPathArray.join('/')}/<account>`
  };
  return [path, index];
};

// Handles creating a value transfer for a base asset based on transaction value field
export const handleBaseAssetTransfer = (
  valueTransfers: IFullTxHistoryValueTransfer[],
  value: string,
  toAddr: TAddress,
  fromAddr: TAddress,
  baseAsset: Asset
): IFullTxHistoryValueTransfer[] => 
  (valueTransfers.length == 0 && !bigify(value).isZero())
    ? addBaseAssetValueTransfer(valueTransfers, fromAddr, toAddr, value, baseAsset)
    : valueTransfers

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

export const buildTxHistoryEntry = (networks: Network[], contacts: ExtendedContact[], contracts: ExtendedContract[], assets: ExtendedAsset[], accounts: StoreAccount[]) =>
  (txTypeMetas: ITxMetaTypes, accountsMap: Record<string, boolean>) =>
  (tx: ITxReceipt): ITxHistoryEntry => {
  const network = networks.find(({ id }) => tx.baseAsset.networkId === id)!;

  // if Txhistory contains a deleted network ie. MATIC remove from history.
  if (!network) return {} as ITxHistoryEntry;

  const toAddressBookEntry = getContactByAddressAndNetworkId(contacts, contracts)(
    tx.receiverAddress ?? tx.to,
    network.id
  );
  const fromAddressBookEntry = getContactByAddressAndNetworkId(contacts, contracts)(
    tx.from,
    network.id
  );
  const derivedTxType = deriveTxType(txTypeMetas, accounts, tx)
  let valueTransfers = tx.valueTransfers ?? []
  // handles base asset value transfer based off transaction.value
  valueTransfers = handleBaseAssetTransfer(valueTransfers, tx.value.toString(), tx.to, tx.from, tx.baseAsset)

  // handles unknown internal transaction value transfer in exchange tx types.
  // @todo: remove when we have access to internal transactions
  valueTransfers = handleIncExchangeTransaction(valueTransfers, txTypeMetas, accountsMap, derivedTxType, tx.from, tx.to, network)
  
  return {
    ...tx,
    valueTransfers: valueTransfers,
    timestamp: tx.timestamp ?? 0,
    txType: derivedTxType,
    toAddressBookEntry,
    fromAddressBookEntry,
    networkId: network.id,
    displayAsset: deriveDisplayAsset(derivedTxType, tx.to, network.id, network.chainId, valueTransfers, getAssetByContractAndNetworkId(assets))
  };
}
