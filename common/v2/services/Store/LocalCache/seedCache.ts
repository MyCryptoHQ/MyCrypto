import { isDevelopment, generateUUID } from 'v2/utils';
import {
  Fiats,
  ContractsData,
  AssetsData,
  NODES_CONFIG,
  NETWORKS_CONFIG,
  testAccounts,
  testAssets,
  testAddressBook,
  testSettings
} from 'v2/config';
import {
  Asset,
  Contract,
  NodeOptions,
  Network,
  NetworkLegacy,
  NetworkId,
  InsecureWalletName
} from 'v2/types';
import { hardRefreshCache, getCacheRaw, setCache } from './LocalCache';
import { CACHE_KEY } from './constants';

/*
   Extracted from LocalCache.ts.
   Needs to be refactored and mereged with v2/config & contstants.ts

*/

// Initialization
export const initializeCache = () => {
  const check = localStorage.getItem(CACHE_KEY);
  if (!check || check === '[]' || check === '{}') {
    hardRefreshCache();
    initFiatCurrencies();
    initNetworks();
    initNodeOptions();
    initSettings();
    initContracts();
    initAssets();

    if (isDevelopment) {
      initTestAccounts();
    }
  }
};

export const initSettings = () => {
  const newStorage = getCacheRaw();
  newStorage.settings = testSettings;
  setCache(newStorage);
};

export const initNodeOptions = () => {
  const newStorage = getCacheRaw();
  const nodeData: Record<string, NodeOptions[]> = NODES_CONFIG;
  Object.keys(nodeData).map(en => {
    const networkNodes = nodeData[en];
    networkNodes.map(entry => {
      const newNode: NodeOptions = {
        name: entry.name,
        type: entry.type,
        service: entry.service,
        url: entry.url
      };
      newStorage.networks[en].nodes.push(newNode);
    });
  });
  setCache(newStorage);
};

export const initNetworks = () => {
  const newStorage = getCacheRaw();
  const allNetworks: NetworkId[] = Object.keys(NETWORKS_CONFIG) as NetworkId[];
  allNetworks.map((networkId: NetworkId) => {
    const newContracts: [string, Contract][] = Object.entries(newStorage.contracts).filter(
      ([, contract]) => contract.networkId === networkId
    );

    const newAssets: [string, Asset][] = Object.entries(newStorage.assets).filter(
      ([, asset]) => asset.networkId === networkId
    );

    const baseAssetID = generateUUID();
    const network: NetworkLegacy = NETWORKS_CONFIG[networkId];
    const newLocalNetwork: Network = {
      contracts: Object.keys(newContracts),
      assets: Object.keys(newAssets),
      nodes: [],
      baseAsset: baseAssetID,
      id: network.id,
      name: network.name,
      chainId: network.chainId,
      isCustom: network.isCustom,
      color: network.color,
      dPaths: {
        ...network.dPaths,
        default: network.dPaths[InsecureWalletName.MNEMONIC_PHRASE]
      },
      gasPriceSettings: network.gasPriceSettings,
      shouldEstimateGasPrice: network.shouldEstimateGasPrice
    };
    const newLocalAssetOption: Asset = {
      uuid: baseAssetID,
      name: network.name,
      networkId: network.name as NetworkId,
      ticker: network.unit,
      type: 'base',
      decimal: 18
    };
    newStorage.networks[networkId] = newLocalNetwork;
    newStorage.assets[baseAssetID] = newLocalAssetOption;
  });
  setCache(newStorage);
};

export const initAssets = () => {
  const newStorage = getCacheRaw();
  const assets = AssetsData();
  Object.keys(assets).map(en => {
    if (assets[en] && assets[en].networkId) {
      const uuid = generateUUID();
      const networkName = assets[en].networkId;
      // @ts-ignore readonly
      assets[en].uuid = uuid;
      newStorage.assets[uuid] = assets[en];
      if (networkName) {
        newStorage.networks[networkName].assets.push(uuid);
      }
    }
  });
  setCache(newStorage);
};

export const initContracts = () => {
  const newStorage = getCacheRaw();
  const contracts = ContractsData();
  Object.keys(contracts).map(en => {
    newStorage.contracts[en] = contracts[en];
    newStorage.networks[contracts[en].networkId].contracts.push(en);
  });
  setCache(newStorage);
};

export const initFiatCurrencies = () => {
  const newStorage = getCacheRaw();
  Object.values(Fiats).map(en => {
    const uuid = generateUUID();
    newStorage.assets[uuid] = {
      uuid,
      ticker: en.code,
      name: en.name,
      networkId: undefined,
      type: 'fiat',
      decimal: 0
    };
  });
  setCache(newStorage);
};

export const initTestAccounts = () => {
  const newStorage = getCacheRaw();
  const newAccounts = testAccounts;
  const newAssets = testAssets;
  const newLabels = testAddressBook;

  newAccounts.map(accountToAdd => {
    const uuid = generateUUID();
    // Map test UUID to actual UUID generated previously
    Object.values(accountToAdd.assets).forEach(asset => {
      const assetDefinition = newAssets[asset.uuid];
      if (assetDefinition.type === 'base') {
        const match = Object.values(newStorage.networks).find(
          network => network.id === assetDefinition.networkId
        );
        // @ts-ignore readonly
        asset.uuid = match ? match.baseAsset : asset.uuid;
      } else {
        const match = Object.values(newStorage.assets).find(
          a =>
            a.contractAddress &&
            assetDefinition.contractAddress &&
            a.contractAddress === assetDefinition.contractAddress
        );
        // @ts-ignore readonly
        asset.uuid = match ? match.uuid : asset.uuid;
      }
    });
    newStorage.accounts[uuid] = accountToAdd;
    newStorage.settings.dashboardAccounts.push(uuid);
  });
  Object.keys(newLabels).map(labelId => {
    newStorage.addressBook[labelId] = newLabels[labelId];
  });
  setCache(newStorage);
};

/* Not deleting in case we need it later.
export const initDerivationPathOptions = () => {
  const newStorage = getCacheRaw();
  DPaths.map(en => {
    newStorage.derivationPathOptions[en.label] = {
      name: en.label,
      derivationPath: en.value,
      active: false
    };
  });
  setCache(newStorage);
};
*/
