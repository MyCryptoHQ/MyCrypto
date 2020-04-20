import { Omit, ValuesType } from 'utility-types';
import { isEmpty } from 'ramda';

import {
  LocalStorage,
  Network,
  NetworkId,
  Notification,
  ExtendedAddressBook,
  ExtendedNotification,
  LSKeys,
  TUuid,
  DataStore,
  ExtendedContract,
  ExtendedAsset,
  TAddress,
  NetworkNodes
} from 'v2/types';
import { makeExplorer } from 'v2/services/EthService';
import { NETWORKS_CONFIG, SCHEMA_BASE, NetworkConfig } from 'v2/database/data';
import { createDefaultValues } from 'v2/database';

type ObjToArray = <T>(o: T) => ValuesType<T>[];
const objToArray: ObjToArray = (obj) => Object.values(obj);
type ArrayToObj = <K extends string | number>(
  k: K
) => <V extends any[]>(arr: V) => Record<K, ValuesType<V>>;
const arrayToObj: ArrayToObj = (key) => (arr) =>
  arr.reduce((acc, curr) => ({ ...acc, [curr[key]]: curr }), {});

export const mergeConfigWithLocalStorage = (
  defaultConfig: NetworkConfig,
  ls: LocalStorage
): LocalStorage => {
  // add contracts and assets from localstorage
  const lsContracts = objToArray(ls[LSKeys.CONTRACTS]) as ExtendedContract[];
  const lsAssets = objToArray(ls[LSKeys.ASSETS]) as ExtendedAsset[];
  lsContracts.forEach(
    (c) => defaultConfig[c.networkId] && defaultConfig[c.networkId].contracts.push(c)
  );
  lsAssets.forEach(
    (a) =>
      a.networkId &&
      defaultConfig[a.networkId] &&
      defaultConfig[a.networkId].tokens.push({ ...a, address: a.contractAddress as TAddress })
  );

  // add selected and custom nodes per network
  if (ls[LSKeys.NETWORK_NODES]) {
    Object.entries(ls[LSKeys.NETWORK_NODES]).forEach(
      ([networkId, networkSetup]: [NetworkId, NetworkNodes]) => {
        defaultConfig[networkId].selectedNode = networkSetup.selectedNode;
        if (networkSetup.nodes) {
          defaultConfig[networkId].nodes = networkSetup.nodes;
        }
      }
    );
  }

  return createDefaultValues(SCHEMA_BASE, defaultConfig);
};

// From LocalStorage to the state we want to use within the app.
export function marshallState(ls: LocalStorage): DataStore {
  const mergedLs = mergeConfigWithLocalStorage(NETWORKS_CONFIG, ls);

  return {
    version: ls.version,
    [LSKeys.ACCOUNTS]: Object.values(ls[LSKeys.ACCOUNTS]),
    [LSKeys.ADDRESS_BOOK]: Object.entries(ls[LSKeys.ADDRESS_BOOK]).reduce(
      (acc, [uuid, contact]: [TUuid, ExtendedAddressBook]) => {
        return acc.concat([{ ...contact, uuid }]);
      },
      [] as ExtendedAddressBook[]
    ),
    [LSKeys.ASSETS]: objToArray(mergedLs[LSKeys.ASSETS]) as ExtendedAsset[],
    [LSKeys.CONTRACTS]: objToArray(mergedLs[LSKeys.CONTRACTS]) as ExtendedContract[],
    [LSKeys.NETWORKS]: Object.values(mergedLs[LSKeys.NETWORKS]).map(
      ({ blockExplorer, ...rest }) => ({
        ...rest,
        blockExplorer: blockExplorer ? makeExplorer(blockExplorer) : blockExplorer
      })
    ),
    [LSKeys.NOTIFICATIONS]: Object.entries(ls[LSKeys.NOTIFICATIONS]).reduce(
      (acc, [uuid, n]: [TUuid, Notification]) => {
        return acc.concat([{ ...n, uuid }]);
      },
      [] as ExtendedNotification[]
    ),
    [LSKeys.SETTINGS]: ls[LSKeys.SETTINGS],
    [LSKeys.PASSWORD]: ls[LSKeys.PASSWORD]
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
export function deMarshallState(st: DataStore): Omit<LocalStorage, 'mtime'> {
  return {
    version: st.version,
    [LSKeys.ACCOUNTS]: arrayToObj('uuid')(
      st[LSKeys.ACCOUNTS].map((x) => ({ ...x, network: undefined }))
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
    [LSKeys.NETWORK_NODES]: constructNetworkNodes(st[LSKeys.NETWORKS])
  };
}
