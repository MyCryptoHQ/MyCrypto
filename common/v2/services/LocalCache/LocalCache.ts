import * as types from 'v2/services';
import { CACHE_INIT, CACHE_INIT_DEV, CACHE_KEY } from './constants';
import { isDevelopment } from 'v2/utils';
import { DPaths, Fiats } from 'config';
import { ContractsData } from 'config/cacheData';
//import { STATIC_NETWORKS_INITIAL_STATE } from 'features/config/networks/static/reducer';

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
      /*
      const length = Object.keys(STATIC_NETWORKS_INITIAL_STATE);
      const obj = {} as  Record<string, types.NetworkOptions>;
      console.log('length: ' + JSON.stringify(length, null, 4));
      length.map((en: any) => {
        const newLocal: types.NetworkOptions = {
          contracts: [],
          assets: [],
          nodes: [],
          id: STATIC_NETWORKS_INITIAL_STATE[en].id,
          name: STATIC_NETWORKS_INITIAL_STATE[en].name,
          unit: STATIC_NETWORKS_INITIAL_STATE[en].unit,
          chainId: STATIC_NETWORKS_INITIAL_STATE[en].chainid,
          isCustom: STATIC_NETWORKS_INITIAL_STATE[en].isCustom,
          color: STATIC_NETWORKS_INITIAL_STATE[en].color,
          blockExplorer: {},
          tokenExplorer: {},
          tokens: {},
          dPathFormats: {},
          gasPriceSettings: STATIC_NETWORKS_INITIAL_STATE[en].GasPriceSetting,
          shouldEstimateGasPrice: STATIC_NETWORKS_INITIAL_STATE[en].shouldEstimateGasPrice
        }
        //console.log('en: ' + en);
        //console.log('static-blah: ' + STATIC_NETWORKS_INITIAL_STATE)
        //const data: types.NetworkOptions = {...};
        obj[en] = newLocal;
      
      });
      */
      // End region:NetworkOptions

      // Start region:AccountType
      const accountTypes: Record<string, types.AccountType> = {
        metamask: {
          name: 'MetaMask',
          key: 'metamask',
          secure: true,
          derivationPath: '',
          web3: true,
          hardware: false
        },
        ledger: {
          name: 'Ledger',
          key: 'ledger',
          secure: true,
          derivationPath: '',
          web3: false,
          hardware: true
        },
        trezor: {
          name: 'Trezor',
          key: 'trezor',
          secure: true,
          derivationPath: '',
          web3: false,
          hardware: true
        },
        keystore: {
          name: 'JSON Keystore File',
          key: 'keystore',
          secure: false,
          derivationPath: '',
          web3: false,
          hardware: false
        },
        mnemonic: {
          name: 'Mnemonic Phrase',
          key: 'mnemonic',
          secure: false,
          derivationPath: '',
          web3: false,
          hardware: false
        },
        privatekey: {
          name: 'Private Key',
          key: 'privatekey',
          secure: false,
          derivationPath: '',
          web3: false,
          hardware: false
        },
        paritysigner: {
          name: 'MetaMask',
          key: 'metamask',
          secure: true,
          derivationPath: '',
          web3: true,
          hardware: false
        },
        safetmini: {
          name: 'Safe-T Mini',
          key: 'safetmini',
          secure: true,
          derivationPath: '',
          web3: false,
          hardware: true
        }
      };
      cache.accountTypes = accountTypes;
      Object.keys(accountTypes).map((en: string) => {
        cache.allAccountTypes.push(en);
      });
      // End region:AccountType

      // Start region:GlobalSettings
      (cache.globalSettings = {
        fiatCurrency: 'USD',
        darkMode: false
      }),
        // End region:GlobalSettings

        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  }
};
