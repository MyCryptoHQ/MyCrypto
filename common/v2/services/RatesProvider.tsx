import React, { createContext, useContext, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { StoreContext, AccountContext, SettingsContext, NetworkContext } from 'v2/services/Store';
import { PollingService } from 'v2/workers';
import { IRates, TTicker, Asset } from 'v2/types';
import { notUndefined, getUUIDForAsset } from 'v2/utils';
import { checkHttpStatus, parseJSON } from './ApiService/utils';

interface State {
  rates: IRates;
  getRate(ticker: TTicker): number | undefined;
  getRateFromAsset(asset: Asset): number | undefined;
}

interface AssetMappingObject {
  coinGeckoId?: string;
  cryptoCompareId?: string;
  coinCapId?: string;
}

interface AssetMappingListObject {
  [key: string]: AssetMappingObject;
}

const DEFAULT_FIAT_PAIRS = ['USD', 'EUR'] as TTicker[];
const DEFAULT_FIAT_RATE = 0;
const POLLING_INTERRVAL = 60000;
const ASSET_ID_MAPPING_URL =
  'https://raw.githubusercontent.com/MyCryptoHQ/assets/master/assets/assets.json';
const TOKEN_RATES_URL = 'https://api.coingecko.com/api/v3/simple/price';
const buildTokenQueryUrl = (assets: TTicker[], currencies: TTicker[]) => `
  ${TOKEN_RATES_URL}/?ids=${assets.join('%2C')}&vs_currencies=${currencies.join('%2c')}
`;

const fetchAssetMappingList = async (): Promise<AssetMappingListObject | any> => {
  return fetch(ASSET_ID_MAPPING_URL, {
    mode: 'cors'
  })
    .then(checkHttpStatus)
    .then(parseJSON);
};

const destructureCoinGeckoIds = (rates: IRates, assetMap: AssetMappingListObject): IRates => {
  /* {
    "ETH":{ "usd": 123.45,"eur": 234.56 }
  } => {
    [uuid for coinGeckoId: = "ETH"]: { "usd": 123.45, "eur": 234.56 }
  } */
  const updateRateObj = (acc: any, curValue: any): IRates => {
    const data: any = Object.keys(assetMap).find(uuid => assetMap[uuid].coinGeckoId === curValue);
    acc[data] = rates[curValue];
    return acc;
  };

  return Object.keys(rates).reduce(updateRateObj, {} as IRates);
};

const pullCoinGeckoIDs = (assetMap: AssetMappingListObject, uuids: string[]): string[] =>
  uuids
    .map((uuid: string) => (!assetMap || !assetMap[uuid] ? undefined : assetMap[uuid].coinGeckoId))
    .filter(notUndefined);

type IWorker = PollingService | undefined;

export const RatesContext = createContext({} as State);

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const { accounts: rawAccounts } = useContext(AccountContext);
  const { assetIDs } = useContext(StoreContext);
  const { settings, updateSettingsRates } = useContext(SettingsContext);
  const { getNetworkByName } = useContext(NetworkContext);
  const [rates, setRates] = useState(settings.rates || {});
  const [isSettingsInitialized, setIsSettingsInitialized] = useState(false);
  const [worker, setWorker] = useState(undefined as IWorker);

  useEffect(() => {
    if (isEmpty(rates) || isSettingsInitialized) return;
    updateSettingsRates(rates);
    setIsSettingsInitialized(true);
  }, [rates, isSettingsInitialized]);

  useEffect(() => {
    // Save settings rates again when the assets change.
    setIsSettingsInitialized(false);
  }, [Object.keys(rates)]);

  useEffect(() => {
    if (!worker) return;
    worker.start();
  }, [worker]);

  const currentAssetIDs = assetIDs();
  useEffect(() => {
    // The cryptocompare api that our proxie uses fails gracefully and will return a conversion rate
    // even if some are tickers are invalid (e.g WETH, GoerliETH etc.)
    fetchAssetMappingList().then((coinMappingObj: AssetMappingListObject) => {
      const formattedCoinGeckoIds = pullCoinGeckoIDs(coinMappingObj, currentAssetIDs as string[]);

      const createWorker = () => {
        setWorker(
          new PollingService(
            buildTokenQueryUrl(formattedCoinGeckoIds, DEFAULT_FIAT_PAIRS), // @TODO: figure out how to handle the conversion more elegantly then `DEFAULT_FIAT_RATE`
            POLLING_INTERRVAL,
            (data: IRates) =>
              setRates({ ...rates, ...destructureCoinGeckoIds(data, coinMappingObj) }),
            err => {
              console.debug('[RatesProvider]', err);
              terminateWorker();
            }
          )
        );
      };

      if (!worker) {
        createWorker();
        return;
      }

      const terminateWorker = () => {
        worker.stop();
        worker.close();
      };

      // Stop old worker
      terminateWorker();
      // Create new worker.
      createWorker();

      return terminateWorker; // make sure we terminate the previous worker on teardown.
    });
  }, [rawAccounts, currentAssetIDs.length]); // only update if an account has been added or removed from LocalStorage.

  const state: State = {
    rates: {},
    getRate: (ticker: TTicker) => {
      // @ts-ignore until we find a solution for TS7053 error
      return rates[ticker] ? rates[ticker].usd : DEFAULT_FIAT_RATE;
    },
    getRateFromAsset: (asset: Asset) => {
      const network = getNetworkByName(asset.networkId || '');
      const chainId = network ? network.chainId : 1;
      const uuid = getUUIDForAsset(chainId, asset.contractAddress);
      return rates[uuid] ? rates[uuid].usd : DEFAULT_FIAT_RATE;
    }
  };

  return <RatesContext.Provider value={state}>{children}</RatesContext.Provider>;
}
