import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';

import { usePromise, useEffectOnce } from 'v2/vendor';
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
  // From: { ["ethereum"]: { "usd": 123.45,"eur": 234.56 } }
  // To: { [uuid for coinGeckoId "ethereum"]: { "usd": 123.45, "eur": 234.56 } }
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

export const RatesContext = createContext({} as State);

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const { assetUUIDs } = useContext(StoreContext);
  const { settings, updateSettingsRates } = useContext(SettingsContext);
  const [assetMapping, setAssetMapping] = useState({});
  const worker = useRef<undefined | PollingService>();

  const updateRates = (data: IRates) =>
    updateSettingsRates({ ...state.rates, ...destructureCoinGeckoIds(data, assetMapping) });

  // update rate worker success handler with updated settings context
  useEffect(() => {
    if (worker.current) {
      worker.current.setSuccessHandler(updateRates);
    }
  }, [settings]);

  // Get our asset dict which maps myc_uuids to coingecko_ids
  const mounted = usePromise();
  useEffectOnce(() => {
    (async () => {
      // The cryptocompare api that our proxie uses fails gracefully and will return a conversion rate
      // even if some are tickers are invalid (e.g WETH, GoerliETH etc.)
      const value = await mounted(
        fetchAssetMappingList().then(e => {
          return e;
        })
      );
      setAssetMapping(value);
    })();
  });

  const currentAssetUUIDs = assetUUIDs();

  useEffect(() => {
    // Wait till we have fetched our asset mapping
    if (isEmpty(assetMapping)) return;

    const formattedCoinGeckoIds = pullCoinGeckoIDs(assetMapping, currentAssetUUIDs as TTicker[]);

    worker.current = new PollingService(
      buildAssetQueryUrl(formattedCoinGeckoIds, DEFAULT_FIAT_PAIRS), // @TODO: More elegant conversion then `DEFAULT_FIAT_RATE`
      POLLING_INTERRVAL,
      updateRates,
      err => console.debug('[RatesProvider]', err)
    );

    // Start Polling service
    worker.current.start();

    // Make sure to close the worker onUnMount.
    return () => {
      if (!worker.current) return;
      worker.current.stop();
      worker.current.close();
    };
  }, [assetMapping, currentAssetUUIDs.length]); //

  const state: State = {
    get rates() {
      return settings.rates;
    },
    getRate: (ticker: TTicker) => {
      // @ts-ignore until we find a solution for TS7053 error
      return state.rates[ticker] ? state.rates[ticker].usd : DEFAULT_FIAT_RATE;
    },
    getAssetRate: (asset: Asset) => {
      const uuid = asset.uuid;
      return state.rates[uuid] ? state.rates[uuid].usd : DEFAULT_FIAT_RATE;
    }
  };

  return <RatesContext.Provider value={state}>{children}</RatesContext.Provider>;
}
