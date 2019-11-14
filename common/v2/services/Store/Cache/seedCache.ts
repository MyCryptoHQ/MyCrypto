import { IS_DEV, generateUUID } from 'v2/utils';
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
  WalletId
} from 'v2/types';
import { hardRefreshCache, updateAll, getCache, readSection } from '../Cache';
import { LOCALSTORAGE_KEY } from './constants';

/*
   Extracted from LocalCache.ts.
   Needs to be refactored and mereged with v2/config & contstants.ts

*/

// Initialization
export const initializeCache = () => {
  const check = localStorage.getItem(LOCALSTORAGE_KEY);
  if (!check || check === '[]' || check === '{}') {
    hardRefreshCache();
    initFiatCurrencies();
    initNetworks();
    initNodeOptions();
    initSettings();
    initContracts();
    initAssets();

    if (IS_DEV) {
      //initTestAccounts();
    }
  }
};

export const initSettings = () => {
  updateAll('settings')(testSettings);
};

export const initNodeOptions = () => {
  const networks = readSection('networks')();
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
      networks[en].nodes.push(newNode);
    });
  });
  updateAll('networks')(networks);
};

export const initNetworks = () => {
  const newStorage = getCache();
  const assets = readSection('assets')();
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
      isTestnet: network.isTestnet,
      color: network.color,
      dPaths: {
        ...network.dPaths,
        default: network.dPaths[WalletId.MNEMONIC_PHRASE]
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
    assets[baseAssetID] = newLocalAssetOption;
  });
  updateAll('networks')(newStorage.networks);
  updateAll('assets')(assets);
};

export const initAssets = () => {
  const networks = readSection('networks')();
  const cachedAssets = readSection('assets')();
  const assets = AssetsData();
  Object.keys(assets).map(en => {
    if (assets[en] && assets[en].networkId) {
      const networkName = assets[en].networkId;
      const uuid = assets[en].uuid;
      cachedAssets[uuid] = assets[en];
      if (networkName) {
        networks[networkName].assets.push(uuid);
      }
    }
  });
  updateAll('networks')(networks);
  updateAll('assets')(cachedAssets);
};

export const initContracts = () => {
  const newStorage = getCache();
  const networks = readSection('networks')();
  const contracts = ContractsData();
  Object.keys(contracts).map(en => {
    newStorage.contracts[en] = contracts[en];
    networks[contracts[en].networkId].contracts.push(en);
  });
  updateAll('contracts')(newStorage.contracts);
  updateAll('networks')(networks);
};

export const initFiatCurrencies = () => {
  const assets = readSection('assets')();
  Object.values(Fiats).map(en => {
    const uuid = generateUUID();
    assets[uuid] = {
      uuid,
      ticker: en.code,
      name: en.name,
      networkId: undefined,
      type: 'fiat',
      decimal: 0
    };
  });
  updateAll('assets')(assets);
};

export const initTestAccounts = () => {
  const newStorage = getCache();
  const settings = readSection('settings')();
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
            a.contractAddress.toUpperCase() === assetDefinition.contractAddress.toUpperCase()
        );
        // @ts-ignore readonly
        asset.uuid = match ? match.uuid : asset.uuid;
      }
    });
    newStorage.accounts[uuid] = accountToAdd;
    settings.dashboardAccounts.push(uuid);
  });
  Object.keys(newLabels).map(labelId => {
    newStorage.addressBook[labelId] = newLabels[labelId];
  });
  updateAll('accounts')(newStorage.accounts);
  updateAll('settings')(settings);
  updateAll('addressBook')(newStorage.addressBook);
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
