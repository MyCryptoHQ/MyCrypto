import React, { createContext, useContext, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { StoreContext, SettingsContext } from 'v2/services/Store';
import { PollingService } from 'v2/workers';
import { IRates, TTicker, Asset } from 'v2/types';
import { notUndefined } from 'v2/utils';
import { AssetMapService } from './ApiService';

interface State {
  rates: IRates;
  getRate(ticker: TTicker): number | undefined;
  getAssetRate(asset: Asset): number | undefined;
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

const ASSET_RATES_URL = 'https://api.coingecko.com/api/v3/simple/price';
const buildAssetQueryUrl = (assets: string[], currencies: string[]) => `
  ${ASSET_RATES_URL}/?ids=${assets}&vs_currencies=${currencies}
`;

const fetchAssetMappingList = async (): Promise<AssetMappingListObject | any> =>
  AssetMapService.instance.getAssetMap();

const destructureCoinGeckoIds = (rates: IRates, assetMap: AssetMappingListObject): IRates => {
  /* {
    "ethereum":{ "usd": 123.45,"eur": 234.56 }
  } => {
    [uuid for coinGeckoId "ethereum"]: { "usd": 123.45, "eur": 234.56 }
  } */

  const updateRateObj = (acc: any, curValue: TTicker): IRates => {
    const data: any = Object.keys(assetMap).find(uuid => assetMap[uuid].coinGeckoId === curValue);
    acc[data] = rates[curValue];
    return acc;
  };

  return Object.keys(rates).reduce(updateRateObj, {} as IRates);
};

const pullCoinGeckoIDs = (assetMap: AssetMappingListObject, uuids: TTicker[]): string[] =>
  uuids
    .map((uuid: TTicker) => (!assetMap || !assetMap[uuid] ? undefined : assetMap[uuid].coinGeckoId))
    .filter(notUndefined);

type IWorker = PollingService | undefined;

export const RatesContext = createContext({} as State);

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const { assetUUIDs } = useContext(StoreContext);
  const { settings, updateSettingsRates } = useContext(SettingsContext);
  const [rates, setRates] = useState(settings.rates || ({} as IRates));
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

  // On changes to the worker, and worker exists then start the worker.
  useEffect(() => {
    if (!worker) return;
    worker.start();
  }, [worker]);

  const currentAssetUUIDs = assetUUIDs();

  // If account assetUUIDs changes, we'll need to create a new worker.
  useEffect(() => {
    // The cryptocompare api that our proxie uses fails gracefully and will return a conversion rate
    // even if some are tickers are invalid (e.g WETH, GoerliETH etc.)
    fetchAssetMappingList().then((coinMappingObj: AssetMappingListObject) => {
      const formattedCoinGeckoIds = pullCoinGeckoIDs(
        coinMappingObj,
        currentAssetUUIDs as TTicker[]
      );

      const createWorker = () => {
        setWorker(
          new PollingService(
            buildAssetQueryUrl(formattedCoinGeckoIds, DEFAULT_FIAT_PAIRS), // @TODO: figure out how to handle the conversion more elegantly then `DEFAULT_FIAT_RATE`
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
      const terminateWorker = () => {
        if (!worker) return;
        worker.stop();
        worker.close();
      };

      // If a worker exists already, terminate the previous worker
      if (worker) {
        terminateWorker();
      }

      // Then create a worker
      createWorker();
      return terminateWorker;
    });
  }, [currentAssetUUIDs.length]);

  const state: State = {
    rates: {},
    getRate: (ticker: TTicker) => {
      // @ts-ignore until we find a solution for TS7053 error
      return rates[ticker] ? rates[ticker].usd : DEFAULT_FIAT_RATE;
    },
    getAssetRate: (asset: Asset) => {
      const uuid = asset.uuid;
      return rates[uuid] ? rates[uuid].usd : DEFAULT_FIAT_RATE;
    }
  };

  return <RatesContext.Provider value={state}>{children}</RatesContext.Provider>;
}
