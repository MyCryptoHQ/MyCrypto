import * as types from 'v2/services';
import { CACHE_INIT, CACHE_INIT_DEV, CACHE_KEY } from './constants';
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
      const cache = CACHE_INIT;

      // Start region:DerivationPathOptions
      DPaths.map(en => {
        cache.derivationPathOptions[en.label] = {
          name: en.label,
          derivationPath: en.value,
          active: false
        };
        cache.allDerivationPathOptions.push(en.label);
      });
      // End region:DerivationPathOptions

      // Start region:FiatCurrencies
      Fiats.map(en => {
        cache.fiatCurrencies[en.code] = {
          code: en.code,
          name: en.name
        };
        cache.allFiatCurrencies.push(en.code);
      });
      // End region:FiatCurrencies

      // Start region:ContractOptions
      const contracts = ContractsData();
      Object.keys(contracts).map(en => {
        cache.contractOptions[en] = contracts[en];
        cache.allContractOptions.push(en);
      });
      // End region:ContractOptions

      // Start region:NetworkOptions
      const length: string[] = Object.keys(STATIC_NETWORKS_INITIAL_STATE);
      length.map((en: any) => {
        const newContracts: string[] = [];
        Object.keys(cache.contractOptions).map(entry => {
          if (cache.contractOptions[entry].network === en) {
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
        cache.networkOptions[en] = newLocalNetwork;
        cache.allNetworkOptions.push(en);
      });
      // End region:NetworkOptions

      // Start region:NodeOptions
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
          cache.nodeOptions[newNode.name] = newNode;
          cache.allNodeOptions.push(newNode.name);
          cache.networkOptions[en].nodes.push(newNode.name);
        });
      });
      // End region:NodeOptions

      // Start region:AccountType
      const accountTypes: Record<string, types.AccountType> = ACCOUNTTYPES;
      cache.accountTypes = accountTypes;
      Object.keys(accountTypes).map((en: string) => {
        cache.allAccountTypes.push(en);
      });
      // End region:AccountType

      // Start region:GlobalSettings
      cache.globalSettings = {
        fiatCurrency: 'USD',
        darkMode: false
      };
      // End region:GlobalSettings

      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  }
};
