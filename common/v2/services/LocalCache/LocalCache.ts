import * as utils from 'v2/libs';
import * as types from 'v2/services';
import { CACHE_INIT, CACHE_KEY, ENCRYPTED_CACHE_KEY, LocalCache } from './constants';
import { DPaths, Fiats } from 'config';
import { ContractsData, AssetOptionsData } from 'v2/config/cacheData';
import { ACCOUNTTYPES } from 'v2/config';
import { NODE_CONFIGS } from 'libs/nodes';
import { STATIC_NETWORKS_INITIAL_STATE } from 'features/config/networks/static/reducer';

// Initialization

export const initializeCache = () => {
  const check = localStorage.getItem(CACHE_KEY);
  if (!check || check === '[]' || check === '{}') {
    hardRefreshCache();

    initDerivationPathOptions();

    initFiatCurrencies();

    initNetworkOptions();

    initNodeOptions();

    initAccountTypes();

    initGlobalSettings();

    initContractOptions();

    initAssetOptions();
  }
};

export const hardRefreshCache = () => {
  setCache(CACHE_INIT);
};

export const initGlobalSettings = () => {
  const newStorage = getCacheRaw();
  newStorage.globalSettings = {
    fiatCurrency: 'USD',
    darkMode: false
  };
  setCache(newStorage);
};

export const initAccountTypes = () => {
  const newStorage = getCacheRaw();
  const accountTypes: Record<string, types.AccountType> = ACCOUNTTYPES;
  newStorage.accountTypes = accountTypes;
  setCache(newStorage);
};

export const initNodeOptions = () => {
  const newStorage = getCacheRaw();
  const nodeData: Record<string, types.NodeOptions[]> = NODE_CONFIGS;
  Object.keys(nodeData).map(en => {
    const networkNodes = nodeData[en];
    networkNodes.map(entry => {
      const newNode: types.NodeOptions = {
        name: entry.name,
        type: entry.type,
        service: entry.service,
        url: entry.url
      };
      newStorage.nodeOptions[newNode.name] = newNode;
      newStorage.networkOptions[en].nodes.push(newNode.name);
    });
  });
  setCache(newStorage);
};

export const initNetworkOptions = () => {
  const newStorage = getCacheRaw();
  const allNetworks: string[] = Object.keys(STATIC_NETWORKS_INITIAL_STATE);
  allNetworks.map((en: any) => {
    const newContracts: string[] = [];
    const newAssetOptions: string[] = [];
    Object.keys(newStorage.contractOptions).map(entry => {
      if (newStorage.contractOptions[entry].network === en) {
        newContracts.push(entry);
      }
    });
    Object.keys(newStorage.assetOptions).map(entry => {
      if (newStorage.assetOptions[entry].network === en) {
        newAssetOptions.push(entry);
      }
    });
    const newLocalNetwork: types.NetworkOptions = {
      contracts: newContracts,
      assets: [STATIC_NETWORKS_INITIAL_STATE[en].id, ...newAssetOptions],
      nodes: [],
      id: STATIC_NETWORKS_INITIAL_STATE[en].id,
      name: STATIC_NETWORKS_INITIAL_STATE[en].name,
      unit: STATIC_NETWORKS_INITIAL_STATE[en].unit,
      chainId: STATIC_NETWORKS_INITIAL_STATE[en].chainId,
      isCustom: STATIC_NETWORKS_INITIAL_STATE[en].isCustom,
      color: STATIC_NETWORKS_INITIAL_STATE[en].color,
      blockExplorer: {},
      tokenExplorer: {},
      tokens: {},
      dPathFormats: {},
      gasPriceSettings: STATIC_NETWORKS_INITIAL_STATE[en].gasPriceSettings,
      shouldEstimateGasPrice: STATIC_NETWORKS_INITIAL_STATE[en].shouldEstimateGasPrice
    };
    const newLocalAssetOption: types.AssetOption = {
      name: STATIC_NETWORKS_INITIAL_STATE[en].name,
      network: en,
      ticker: en,
      type: 'base',
      decimal: 18,
      contractAddress: null
    };
    newStorage.networkOptions[en] = newLocalNetwork;
    newStorage.assetOptions[STATIC_NETWORKS_INITIAL_STATE[en].id] = newLocalAssetOption;
  });
  setCache(newStorage);
};

export const initAssetOptions = () => {
  const newStorage = getCacheRaw();
  const contracts = AssetOptionsData();
  Object.keys(contracts).map(en => {
    newStorage.assetOptions[en] = contracts[en];
    newStorage.networkOptions[contracts[en].network].contracts.push(en);
  });
  setCache(newStorage);
};

export const initContractOptions = () => {
  const newStorage = getCacheRaw();
  const contracts = ContractsData();
  Object.keys(contracts).map(en => {
    newStorage.contractOptions[en] = contracts[en];
    newStorage.networkOptions[contracts[en].network].contracts.push(en);
  });
  setCache(newStorage);
};

export const initFiatCurrencies = () => {
  const newStorage = getCacheRaw();
  Fiats.map(en => {
    newStorage.fiatCurrencies[en.code] = {
      code: en.code,
      name: en.name
    };
  });
  setCache(newStorage);
};

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

// Low level operations

const getCacheRaw = (): LocalCache => {
  const text = localStorage.getItem(CACHE_KEY);
  return text ? JSON.parse(text) : CACHE_INIT;
};

export const getCache = (): LocalCache => {
  initializeCache();
  return getCacheRaw();
};

export const setCache = (newCache: LocalCache) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
};

export const destroyCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

export const getEncryptedCache = (): string => {
  return localStorage.getItem(ENCRYPTED_CACHE_KEY) || '';
};

export const setEncryptedCache = (newEncryptedCache: string) => {
  localStorage.setItem(ENCRYPTED_CACHE_KEY, newEncryptedCache);
};

export const destroyEncryptedCache = () => {
  localStorage.removeItem(ENCRYPTED_CACHE_KEY);
};

// Settings operations

type SettingsKey = 'currents' | 'globalSettings' | 'screenLockSettings';

export const readSettings = <K extends SettingsKey>(key: K) => () => {
  return getCache()[key];
};

export const updateSettings = <K extends SettingsKey>(key: K) => (value: LocalCache[K]) => {
  const newCache = getCache();
  newCache[key] = value;

  setCache(newCache);
};

// Collection operations

type CollectionKey =
  | 'accounts'
  | 'accountTypes'
  | 'activeNotifications'
  | 'addressMetadata'
  | 'assetOptions'
  | 'assets'
  | 'contractOptions'
  | 'derivationPathOptions'
  | 'fiatCurrencies'
  | 'localSettings'
  | 'networkOptions'
  | 'nodeOptions'
  | 'transactionHistories'
  | 'transactions';

export const create = <K extends CollectionKey>(key: K) => (
  value: LocalCache[K][keyof LocalCache[K]]
) => {
  const uuid = utils.generateUUID();

  const newCache = getCache();
  newCache[key][uuid] = value;

  setCache(newCache);
};

export const read = <K extends CollectionKey>(key: K) => (uuid: string): LocalCache[K][string] => {
  return getCache()[key][uuid];
};

export const update = <K extends CollectionKey>(key: K) => (
  uuid: string,
  value: LocalCache[K][keyof LocalCache[K]]
) => {
  const newCache = getCache();
  newCache[key][uuid] = value;

  setCache(newCache);
};

export const destroy = <K extends CollectionKey>(key: K) => (uuid: string) => {
  const parsedLocalCache = getCache();
  delete parsedLocalCache[key][uuid];
  const newCache = parsedLocalCache;
  setCache(newCache);
};

export const readAll = <K extends CollectionKey>(key: K) => () => {
  const section: LocalCache[K] = getCache()[key];
  const sectionEntries: [string, LocalCache[K][string]][] = Object.entries(section);
  return sectionEntries.map(([uuid, value]) => ({ ...value, uuid }));
};
