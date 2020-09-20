import chain from 'ramda/src/chain';
import filter from 'ramda/src/filter';
import map from 'ramda/src/map';
import mapObjIndexed from 'ramda/src/mapObjIndexed';
import mergeRight from 'ramda/src/mergeRight';
import pipe from 'ramda/src/pipe';
import reduce from 'ramda/src/reduce';

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
  WalletId
} from '@types';
import { generateAssetUUID, generateDeterministicAddressUUID } from '@utils';

import { NetworkConfig, NETWORKS_CONFIG, NODES_CONFIG } from './data';
import { add, toArray, toObject } from './helpers';
import { SeedData, StoreAction } from './types';

/* Transducers */
const addNetworks = add(LSKeys.NETWORKS)((networks: SeedData) => {
  const formatNetwork = (n: NetworkLegacy): Network => {
    const baseAssetUuid = generateAssetUUID(n.chainId);
    // add custom nodes from local storage
    const nodes: NodeOptions[] = [...(NODES_CONFIG[n.id] || []), ...(n.nodes || [])];
    const [firstNode] = nodes;

    return Object.assign(
      {
        // Also available are: blockExplorer, tokenExplorer, tokens aka assets, contracts
        id: n.id,
        name: n.name,
        chainId: n.chainId,
        isCustom: n.isCustom,
        isTestnet: n.isTestnet,
        color: n.color,
        gasPriceSettings: n.gasPriceSettings,
        shouldEstimateGasPrice: n.shouldEstimateGasPrice,
        dPaths: {
          ...n.dPaths,
          default: n.dPaths[WalletId.MNEMONIC_PHRASE] // Set default dPath
        },
        blockExplorer: n.blockExplorer,
        tokenExplorer: n.tokenExplorer,
        contracts: [],
        assets: [],
        baseAsset: baseAssetUuid, // Set baseAssetUuid
        baseUnit: n.unit,
        nodes
      },
      firstNode
        ? {
          // Extend network if nodes are defined
          autoNode: firstNode.name, // Select first node as auto
          selectedNode: n.selectedNode || firstNode.name // Select first node as default
        }
        : {}
    );
  };

  return mapObjIndexed(formatNetwork, networks);
});

const addContracts = add(LSKeys.CONTRACTS)(
  (networks: Record<NetworkId, NetworkLegacy>, store: LocalStorage) => {
    const formatContract = (id: NetworkId) => (c: ContractLegacy): ExtendedContract => ({
      uuid: c.uuid || generateDeterministicAddressUUID(id, c.address),
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
    name: n.name,
    networkId: n.id,
    type: 'base',
    decimal: DEFAULT_ASSET_DECIMAL
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

const updateNetworkAssets = add(LSKeys.NETWORKS)((_, store: LocalStorage) => {
  // Since we added baseAsset and tokens to Assets this will return both.
  const findNetworkAssets = (nId: NetworkId): Asset[] =>
    toArray(store.assets).filter((a) => a.networkId === nId);

  const getAssetUuid = (n: Network) =>
    findNetworkAssets(n.id)
      .filter(Boolean)
      .map((a) => a.uuid);

  return mapObjIndexed(
    (n: Network) => ({
      ...n,
      assets: [...n.assets, ...getAssetUuid(n)]
    }),
    store.networks
  );
});

/* Define flow order */
const getDefaultTransducers = (networkConfig: NetworkConfig): StoreAction[] => [
  addNetworks(networkConfig),
  addContracts(networkConfig),
  addContractsToNetworks(),
  addBaseAssetsToAssets(),
  addFiatsToAssets(toArray(Fiats)),
  addTokensToAssets(networkConfig),
  updateNetworkAssets()
];

/* Handler to trigger the flow according the environment */
type Transduce = (z: LocalStorage, networkConfig: NetworkConfig) => LocalStorage;
export const createDefaultValues: Transduce = (initialSchema: LocalStorage, networkConfig) => {
  // @ts-ignore
  return pipe(...getDefaultTransducers(networkConfig))(initialSchema);
};
