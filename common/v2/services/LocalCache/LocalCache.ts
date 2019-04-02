import * as types from 'v2/services';
import { CACHE_INIT, CACHE_INIT_DEV, CACHE_KEY, LocalCache } from './constants';
import { isDevelopment } from 'v2/utils';
import { DPaths, Fiats } from 'config';
import { ContractsData } from 'config/cacheData';
import { ACCOUNTTYPES } from 'v2/config';
import { NODE_CONFIGS } from 'libs/nodes';
import { STATIC_NETWORKS_INITIAL_STATE } from 'features/config/networks/static/reducer';

export const initializeCache = () => {
  const check = localStorage.getItem(CACHE_KEY);
  if (!check || check === '[]' || check === '{}') {
    if (isDevelopment) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(CACHE_INIT_DEV));
    } else {
      hardRefreshCache();

      initDerivationPathOptions();

      initFiatCurrencies();

      initNetworkOptions();

      initNodeOptions();

      initAccountTypes();

      initGlobalSettings();

      initContractOptions();
    }
  }
};

export const hardRefreshCache = () => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(CACHE_INIT));
};

export const initGlobalSettings = () => {
  const newStorage: LocalCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  newStorage.globalSettings = {
    fiatCurrency: 'USD',
    darkMode: false
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(newStorage));
};

export const initAccountTypes = () => {
  const newStorage: LocalCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const accountTypes: Record<string, types.AccountType> = ACCOUNTTYPES;
  newStorage.accountTypes = accountTypes;
  Object.keys(accountTypes).map((en: string) => {
    newStorage.allAccountTypes.push(en);
  });
  localStorage.setItem(CACHE_KEY, JSON.stringify(newStorage));
};

export const initNodeOptions = () => {
  const newStorage: LocalCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
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
      newStorage.allNodeOptions.push(newNode.name);
      newStorage.networkOptions[en].nodes.push(newNode.name);
    });
  });
  localStorage.setItem(CACHE_KEY, JSON.stringify(newStorage));
};

export const initNetworkOptions = () => {
  const newStorage: LocalCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const length: string[] = Object.keys(STATIC_NETWORKS_INITIAL_STATE);
  length.map((en: any) => {
    const newContracts: string[] = [];
    Object.keys(newStorage.contractOptions).map(entry => {
      if (newStorage.contractOptions[entry].network === en) {
        newContracts.push(entry);
      }
    });
    const newLocalNetwork: types.NetworkOptions = {
      contracts: newContracts,
      assets: [],
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
    newStorage.networkOptions[en] = newLocalNetwork;
    newStorage.allNetworkOptions.push(en);
  });
  localStorage.setItem(CACHE_KEY, JSON.stringify(newStorage));
};

export const initContractOptions = () => {
  const newStorage: LocalCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const contracts = ContractsData();
  Object.keys(contracts).map(en => {
    newStorage.contractOptions[en] = contracts[en];
    newStorage.allContractOptions.push(en);
    newStorage.networkOptions[contracts[en].network].contracts.push(en);
  });
  localStorage.setItem(CACHE_KEY, JSON.stringify(newStorage));
};

export const initFiatCurrencies = () => {
  const newStorage: LocalCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  Fiats.map(en => {
    newStorage.fiatCurrencies[en.code] = {
      code: en.code,
      name: en.name
    };
    newStorage.allFiatCurrencies.push(en.code);
  });
  localStorage.setItem(CACHE_KEY, JSON.stringify(newStorage));
};

export const initDerivationPathOptions = () => {
  const newStorage: LocalCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  DPaths.map(en => {
    newStorage.derivationPathOptions[en.label] = {
      name: en.label,
      derivationPath: en.value,
      active: false
    };
    newStorage.allDerivationPathOptions.push(en.label);
  });
  localStorage.setItem(CACHE_KEY, JSON.stringify(newStorage));
};

export const getCache = (): LocalCache => {
  initializeCache();

  // We can assume that the MyCryptoCache key exists because it's created in initialCache
  const text = localStorage.getItem('MyCryptoCache') as string;
  return JSON.parse(text);
};

export const setCache = (newCache: LocalCache) => {
  localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
};
