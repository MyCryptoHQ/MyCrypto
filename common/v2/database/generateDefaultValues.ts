import * as R from 'ramda';

import { generateAssetUUID, generateContractUUID } from 'v2/utils';
import { Fiats, DEFAULT_ASSET_DECIMAL } from 'v2/config';
import {
  Asset,
  ExtendedAsset,
  ExtendedContract,
  LocalStorage,
  NetworkId,
  NetworkLegacy,
  WalletId,
  Network,
  TSymbol,
  Fiat,
  ContractLegacy,
  AssetLegacy,
  LSKeys
} from 'v2/types';

import { NODES_CONFIG, NETWORKS_CONFIG, NetworkConfig } from './data';
import { SeedData, StoreAction } from './types';
import { toArray, toObject, add } from './helpers';
/* Transducers */
const addNetworks = add(LSKeys.NETWORKS)((networks: SeedData) => {
  const formatNetwork = (n: NetworkLegacy): Network => {
    const baseAssetUuid = generateAssetUUID(n.chainId);
    const nodes = NODES_CONFIG[n.id] || NODES_CONFIG[n.name as NetworkId] || [];
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
            selectedNode: firstNode.name // Select first node as default
          }
        : {}
    );
  };

  return R.mapObjIndexed(formatNetwork, networks);
});

export const addContracts = add(LSKeys.CONTRACTS)(
  (networks: Record<NetworkId, NetworkLegacy>, store: LocalStorage) => {
    const formatContract = (id: NetworkId) => (c: ContractLegacy): ExtendedContract => ({
      uuid: c.uuid || generateContractUUID(id, c.address, c.abi),
      name: c.name,
      address: c.address,
      abi: c.abi,
      networkId: id,
      isCustom: c.isCustom
    });

    // Transform { ETH: { contracts: [ {<contract>} ] }}
    // to   { <contract_uuid>: {<contract>} }
    return R.pipe(
      R.map(({ id, contracts }) => ({ id, contracts })),
      R.filter(({ contracts }) => contracts),
      R.chain(({ id, contracts }): ExtendedAsset[] => contracts.map(formatContract(id))),
      R.reduce(toObject('uuid'), {} as any),
      R.mergeRight(store.contracts)
    )(toArray(networks));
  }
);

export const addContractsToNetworks = add(LSKeys.NETWORKS)((_, store: LocalStorage) => {
  const getNetworkContracts = (n: Network) => {
    const nContracts = R.filter((c: ExtendedContract) => c.networkId === n.id, store.contracts);
    return {
      ...n,
      contracts: toArray(nContracts).map(c => c.uuid)
    };
  };
  return R.mapObjIndexed(getNetworkContracts, store.networks);
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
  return R.pipe(
    toArray,
    R.map(formatAsset),
    R.reduce((acc, curr) => ({ ...acc, [curr.uuid]: curr }), {}),
    R.mergeRight(store.assets) // Ensure we return an object with existing assets as well
  )(store.networks);
});

const addFiatsToAssets = add(LSKeys.ASSETS)((fiats: Fiat[], store: LocalStorage) => {
  const formatFiat = ({ code, name }: Fiat): ExtendedAsset => ({
    uuid: generateAssetUUID(code, name),
    name,
    ticker: code,
    networkId: undefined,
    type: 'fiat',
    decimal: 0
  });

  // From { <fiat_key>: <fiat_asset> }
  // To   { <asset_uuid>: <asset> }
  return R.pipe(
    R.map(formatFiat),
    R.reduce((acc, curr) => ({ ...acc, [curr.uuid]: curr }), {}),
    R.mergeRight(store.assets)
  )(fiats);
});

const addTokensToAssets = add(LSKeys.ASSETS)(
  (networks: typeof NETWORKS_CONFIG, store: LocalStorage) => {
    const formatToken = (id: NetworkId) => (a: AssetLegacy): ExtendedAsset => ({
      uuid: a.uuid || generateAssetUUID(id), // In case a token doesn't have a pregenerated uuid. eg. RSK
      name: a.name,
      decimal: a.decimal,
      ticker: (a.symbol as unknown) as TSymbol,
      networkId: id,
      contractAddress: a.address,
      type: 'erc20',
      isCustom: a.isCustom
    });

    // From { ETH: { tokens: [ {<tokens>} ] }}
    // to   { <asset_uuid>: {<asset>} }
    return R.pipe(
      R.map(({ id, tokens }) => ({ id, tokens })),
      R.filter(({ tokens }) => tokens),
      R.chain(({ id, tokens }): ExtendedAsset[] => tokens.map(formatToken(id))),
      R.reduce(toObject('uuid'), {} as any),
      R.mergeRight(store.assets)
    )(toArray(networks));
  }
);

const updateNetworkAssets = add(LSKeys.NETWORKS)((_, store: LocalStorage) => {
  // Since we added baseAsset and tokens to Assets this will return both.
  const findNetworkAssets = (nId: NetworkId): Asset[] =>
    toArray(store.assets).filter(a => a.networkId === nId);

  const getAssetUuid = (n: Network) =>
    findNetworkAssets(n.id)
      .filter(Boolean)
      .map(a => a.uuid);

  return R.mapObjIndexed(
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
  return R.pipe(...getDefaultTransducers(networkConfig))(initialSchema);
};
