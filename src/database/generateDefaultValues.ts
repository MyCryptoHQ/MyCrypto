import { DEFAULT_ASSET_DECIMAL, Fiats } from '@config';
import {
  Asset,
  AssetLegacy,
  ContractLegacy,
  ExtendedAsset,
  ExtendedContract,
  Fiat,
  LocalStorage,
  LSKeys,
  Network,
  NetworkId,
  NetworkLegacy,
  NodeOptions,
  NodeType
} from '@types';
import { generateAssetUUID, generateDeterministicAddressUUID } from '@utils/generateUUID';
import { chain, filter, map, mapObjIndexed, mergeRight, pipe, reduce } from '@vendor';

import { NetworkConfig, NETWORKS_CONFIG, NODES_CONFIG } from './data';
import { add, toArray, toObject } from './helpers';
import { StoreAction } from './types';

/* Transducers */
const addNetworks = add(LSKeys.NETWORKS)((networks: typeof NETWORKS_CONFIG) => {
  const formatNetwork = (n: NetworkLegacy): Network => {
    const baseAssetUuid = generateAssetUUID(n.chainId);
    // add custom nodes from local storage
    const nodes: NodeOptions[] = [...(NODES_CONFIG[n.id] ?? []), ...(n.nodes ?? [])];
    const { unit, ...rest } = n;
    return {
      // Also available are: blockExplorer, tokenExplorer, tokens aka assets, contracts
      ...rest,
      baseAsset: baseAssetUuid, // Set baseAssetUuid
      baseUnit: unit,
      nodes: nodes.filter(({ type }) => type !== NodeType.WEB3)
    };
  };

  return mapObjIndexed(formatNetwork, networks);
});

const addContracts = add(LSKeys.CONTRACTS)(
  (networks: Record<NetworkId, NetworkLegacy>, store: LocalStorage) => {
    const formatContract = (id: NetworkId) => (c: ContractLegacy): ExtendedContract => ({
      uuid: c.uuid ?? generateDeterministicAddressUUID(id, c.address),
      name: c.name,
      address: c.address,
      abi: c.abi,
      networkId: id,
      isCustom: c.isCustom
    });

    // Transform { ETH: { contracts: [ {<contract>} ] }}
    // to   { <contract_uuid>: {<contract>} }
    return pipe(
      map(({ id, contracts }) => ({ id, contracts })),
      filter(({ contracts }) => contracts),
      chain(({ id, contracts }): ExtendedAsset[] => contracts.map(formatContract(id))),
      reduce(toObject('uuid'), {} as any),
      mergeRight(store.contracts)
    )(toArray(networks));
  }
);

const addContractsToNetworks = add(LSKeys.NETWORKS)((_, store: LocalStorage) => {
  const getNetworkContracts = (n: Network) => {
    const nContracts = filter((c: ExtendedContract) => c.networkId === n.id, store.contracts);
    return {
      ...n,
      contracts: toArray(nContracts).map((c) => c.uuid)
    };
  };
  return mapObjIndexed(getNetworkContracts, store.networks);
});

const addBaseAssetsToAssets = add(LSKeys.ASSETS)((_, store: LocalStorage) => {
  const formatAsset = (n: Network): Asset => ({
    uuid: n.baseAsset,
    ticker: n.baseUnit,
    name: n.baseUnitName ? n.baseUnitName : n.name,
    networkId: n.id,
    type: 'base',
    decimal: DEFAULT_ASSET_DECIMAL,
    isCustom: n.isCustom
  });

  // From { <networkId>: { baseAsset: <asset_uui> } }
  // To   { <asset_uuid>: <asset> }
  return pipe(
    toArray,
    map(formatAsset),
    reduce((acc, curr) => ({ ...acc, [curr.uuid]: curr }), {}),
    mergeRight(store.assets) // Ensure we return an object with existing assets as well
  )(store.networks);
});

const addFiatsToAssets = add(LSKeys.ASSETS)((fiats: Fiat[], store: LocalStorage) => {
  const formatFiat = ({ ticker, name }: Fiat): ExtendedAsset => ({
    uuid: generateAssetUUID(ticker, name),
    name,
    ticker,
    networkId: 'OldWorld' as NetworkId,
    type: 'fiat',
    decimal: 0
  });

  // From { <fiat_key>: <fiat_asset> }
  // To   { <asset_uuid>: <asset> }
  return pipe(
    map(formatFiat),
    reduce((acc, curr) => ({ ...acc, [curr.uuid]: curr }), {}),
    mergeRight(store.assets)
  )(fiats);
});

const addTokensToAssets = add(LSKeys.ASSETS)(
  (networks: typeof NETWORKS_CONFIG, store: LocalStorage) => {
    const formatToken = (id: NetworkId) => (a: AssetLegacy): ExtendedAsset => ({
      uuid: a.uuid || generateAssetUUID(id), // In case a token doesn't have a pregenerated uuid. eg. RSK
      name: a.name,
      decimal: a.decimal,
      ticker: a.ticker,
      networkId: id,
      contractAddress: a.address,
      type: 'erc20',
      isCustom: a.isCustom
    });

    // From { ETH: { tokens: [ {<tokens>} ] }}
    // to   { <asset_uuid>: {<asset>} }
    return pipe(
      map(({ id, tokens }) => ({ id, tokens })),
      filter(({ tokens }) => tokens),
      chain(({ id, tokens }): ExtendedAsset[] => tokens.map(formatToken(id))),
      reduce(toObject('uuid'), {} as any),
      mergeRight(store.assets)
    )(toArray(networks));
  }
);

/* Define flow order */
const getDefaultTransducers = (networkConfig: NetworkConfig): StoreAction[] => [
  addNetworks(networkConfig),
  addContracts(networkConfig),
  addContractsToNetworks(),
  addBaseAssetsToAssets(),
  addFiatsToAssets(toArray(Fiats)),
  addTokensToAssets(networkConfig)
];

/* Handler to trigger the flow according the environment */
type Transduce = (z: LocalStorage, networkConfig: NetworkConfig) => LocalStorage;
export const createDefaultValues: Transduce = (initialSchema: LocalStorage, networkConfig) => {
  // @ts-expect-error: Ramda typings are at times mysterious
  return pipe(...getDefaultTransducers(networkConfig))(initialSchema);
};
