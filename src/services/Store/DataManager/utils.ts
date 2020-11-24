import isEmpty from 'ramda/src/isEmpty';
import { ValuesType } from 'utility-types';

import { NetworkConfig, NETWORKS_CONFIG, SCHEMA_BASE } from '@database/data';
import { createDefaultValues } from '@database/generateDefaultValues';
import {
  DataStore,
  ExtendedAsset,
  ExtendedContact,
  ExtendedContract,
  ExtendedNotification,
  ExtendedUserAction,
  ITxReceipt,
  LocalStorage,
  LSKeys,
  Network,
  NetworkId,
  NetworkNodes,
  TAddress,
  TUuid
} from '@types';
import { merge } from '@vendor';

type ObjToArray = <T>(o: T) => ValuesType<T>[];
const objToArray: ObjToArray = (obj) => Object.values(obj);
type ArrayToObj = <K extends string | number>(
  k: K
) => <V extends any[]>(arr: V) => Record<K, ValuesType<V>>;
const arrayToObj: ArrayToObj = (key) => (arr) =>
  arr.reduce((acc, curr) => ({ ...acc, [curr[key]]: curr }), {});
type ObjToExtendedArray = <T>(o: T) => unknown[];
export const objToExtendedArray: ObjToExtendedArray = (obj) =>
  Object.entries(obj).reduce((acc, [uuid, n]: [TUuid, typeof obj]) => {
    return acc.concat([{ ...n, uuid }]);
  }, [] as unknown[]);

export const mergeConfigWithLocalStorage = (
  defaultConfig: NetworkConfig,
  ls: LocalStorage
): LocalStorage => {
  const customNetworks = (Object.fromEntries(
    Object.entries(ls.networks)
      .filter((n) => n[1].isCustom)
      .map(([k, v]) => [k, { ...v, tokens: [] }])
  ) as unknown) as NetworkConfig;
  const config = merge(defaultConfig, customNetworks);

  // add contracts and assets from localstorage
  const lsContracts = objToArray(ls[LSKeys.CONTRACTS]) as ExtendedContract[];
  const lsAssets = objToArray(ls[LSKeys.ASSETS]) as ExtendedAsset[];
  lsContracts.forEach((c) => config[c.networkId] && config[c.networkId].contracts.push(c));
  lsAssets.forEach(
    (a) =>
      a.networkId &&
      config[a.networkId] &&
      config[a.networkId].tokens.push({ ...a, address: a.contractAddress as TAddress })
  );

  // add selected and custom nodes per network
  if (ls[LSKeys.NETWORK_NODES]) {
    Object.entries(ls[LSKeys.NETWORK_NODES]).forEach(
      ([networkId, networkSetup]: [NetworkId, NetworkNodes]) => {
        config[networkId].selectedNode = networkSetup.selectedNode;
        if (networkSetup.nodes) {
          config[networkId].nodes = networkSetup.nodes;
        }
      }
    );
  }

  return createDefaultValues(SCHEMA_BASE, config);
};

// From LocalStorage to the state we want to use within the app.
export function marshallState(ls: LocalStorage): DataStore {
  const mergedLs = mergeConfigWithLocalStorage(NETWORKS_CONFIG, ls);

  return {
    version: ls.version,
    [LSKeys.ACCOUNTS]: Object.values(ls[LSKeys.ACCOUNTS]),
    [LSKeys.ADDRESS_BOOK]: objToExtendedArray(ls[LSKeys.ADDRESS_BOOK]) as ExtendedContact[],
    [LSKeys.ASSETS]: objToArray(mergedLs[LSKeys.ASSETS]) as ExtendedAsset[],
    [LSKeys.CONTRACTS]: objToArray(mergedLs[LSKeys.CONTRACTS]) as ExtendedContract[],
    [LSKeys.NETWORKS]: Object.values(mergedLs[LSKeys.NETWORKS]),
    [LSKeys.NOTIFICATIONS]: objToExtendedArray(ls[LSKeys.NOTIFICATIONS]) as ExtendedNotification[],
    [LSKeys.SETTINGS]: ls[LSKeys.SETTINGS],
    [LSKeys.PASSWORD]: ls[LSKeys.PASSWORD],
    [LSKeys.USER_ACTIONS]: ls[LSKeys.USER_ACTIONS]
      ? (objToExtendedArray(ls[LSKeys.USER_ACTIONS]) as ExtendedUserAction[])
      : []
  };
}

export const constructNetworkNodes = (networks: DataStore[LSKeys.NETWORKS]) => {
  const networkNodes = {} as LocalStorage[LSKeys.NETWORK_NODES];
  networks.forEach((n) => {
    const networkSetup: NetworkNodes = {};
    if (n.autoNode !== n.selectedNode) {
      networkSetup.selectedNode = n.selectedNode;
    }
    const customNodes = n.nodes.filter((node) => node.isCustom);
    if (customNodes.length) {
      networkSetup.nodes = customNodes;
    }

    if (!isEmpty(networkSetup)) {
      networkNodes[n.id] = networkSetup;
    }
  });

  return networkNodes;
};

// From convert back to the LocalStorage format.
// The mtime and version are handled by useDatabase
export function deMarshallState(st: DataStore): LocalStorage {
  return {
    version: st.version,
    mtime: Date.now(),
    [LSKeys.ACCOUNTS]: arrayToObj('uuid')(
      st[LSKeys.ACCOUNTS].map((x) => ({
        ...x,
        transactions: x.transactions.map((tx: ITxReceipt) => {
          // @todo: Remove this in the future (7/19/2020)
          // @ts-expect-error: Hack to avoid creating a new migration and rename stage -> status
          const { stage, ...validTx } = tx;
          return { ...validTx, status: tx.status || stage };
        }),
        network: undefined
      }))
    ),
    [LSKeys.ADDRESS_BOOK]: arrayToObj('uuid')(st[LSKeys.ADDRESS_BOOK]),
    [LSKeys.ASSETS]: arrayToObj('uuid')(st[LSKeys.ASSETS].filter((a) => a.isCustom)),
    [LSKeys.CONTRACTS]: arrayToObj('uuid')(st[LSKeys.CONTRACTS].filter((c) => c.isCustom)),
    [LSKeys.NETWORKS]: st[LSKeys.NETWORKS]
      .filter((c) => c.isCustom)
      .reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {} as Record<NetworkId, Network>),
    [LSKeys.NOTIFICATIONS]: arrayToObj('uuid')(st[LSKeys.NOTIFICATIONS]),
    [LSKeys.SETTINGS]: st[LSKeys.SETTINGS],
    [LSKeys.PASSWORD]: st[LSKeys.PASSWORD],
    [LSKeys.NETWORK_NODES]: constructNetworkNodes(st[LSKeys.NETWORKS]),
    [LSKeys.USER_ACTIONS]: arrayToObj('uuid')(st[LSKeys.USER_ACTIONS])
  };
}
