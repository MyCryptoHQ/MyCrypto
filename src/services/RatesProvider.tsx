import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import { usePromise, useEffectOnce } from '@vendor';
import { StoreContext, SettingsContext } from '@services/Store';
import { PollingService } from '@workers';
import { IRates, TTicker, Asset, StoreAsset, ReserveAsset } from '@types';
import { notUndefined } from '@utils';

import { DeFiReserveMapService } from './ApiService';

interface State {
  rates: IRates;
  getRate(ticker: TTicker): number | undefined;
  getAssetRate(asset: Asset): number | undefined;
  getPoolAssetReserveRate(defiPoolTokenUUID: string, assets: Asset[]): ReserveAsset[];
}

interface ReserveMappingRate {
  assetId: string;
  rate: string; // Is a BigNumberJS float string
}

interface ReserveMappingObject {
  type: string;
  lastUpdated: number;
  reserveRates: ReserveMappingRate[];
}

interface ReserveMappingListObject {
  [key: string]: ReserveMappingObject;
}

const DEFAULT_FIAT_PAIRS = ['USD', 'EUR', 'GBP'] as TTicker[];
const DEFAULT_FIAT_RATE = 0;
const POLLING_INTERVAL = 60000;

const ASSET_RATES_URL = 'https://api.coingecko.com/api/v3/simple/price';
const buildAssetQueryUrl = (assets: string[], currencies: string[]) => `
  ${ASSET_RATES_URL}/?ids=${assets}&vs_currencies=${currencies}
`;

const fetchDeFiReserveMappingList = async (): Promise<ReserveMappingListObject | any> =>
  DeFiReserveMapService.instance.getDeFiReserveMap();

const destructureCoinGeckoIds = (rates: IRates, assets: StoreAsset[]): IRates => {
  // From: { ["ethereum"]: { "usd": 123.45,"eur": 234.56 } }
  // To: { [uuid for coinGeckoId "ethereum"]: { "usd": 123.45, "eur": 234.56 } }
  const updateRateObj = (acc: any, curValue: TTicker): IRates => {
    const asset = assets.find((a) => a.mappings && a.mappings.coinGeckoId === curValue);
    acc[asset!.uuid] = rates[curValue];
    return acc;
  };

  return Object.keys(rates).reduce(updateRateObj, {} as IRates);
};

export const RatesContext = createContext({} as State);

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const { assets: getAssets } = useContext(StoreContext);
  const { settings, updateSettingsRates } = useContext(SettingsContext);
  const [reserveRateMapping, setReserveRateMapping] = useState({} as ReserveMappingListObject);
  const worker = useRef<undefined | PollingService>();
  const currentAssets = getAssets();
  const geckoIds = currentAssets.reduce((acc, a) => {
    if (a.mappings && a.mappings.coinGeckoId) {
      acc.push(a.mappings.coinGeckoId);
    }
    return acc;
  }, [] as string[]);
  const updateRates = (data: IRates) =>
    updateSettingsRates({ ...state.rates, ...destructureCoinGeckoIds(data, currentAssets) });

  // update rate worker success handler with updated settings context
  useEffect(() => {
    if (worker.current) {
      worker.current.setSuccessHandler(updateRates);
    }
  }, [settings]);

  const mounted = usePromise();

  useEffectOnce(() => {
    (async () => {
      const value = await mounted(fetchDeFiReserveMappingList());
      setReserveRateMapping(value);
    })();
  });

  useEffect(() => {
    worker.current = new PollingService(
      buildAssetQueryUrl(geckoIds, DEFAULT_FIAT_PAIRS), // @TODO: More elegant conversion then `DEFAULT_FIAT_RATE`
      POLLING_INTERVAL,
      updateRates,
      (err) => console.debug('[RatesProvider]', err)
    );

    // Start Polling service
    worker.current.start();

    // Make sure to close the worker onUnMount.
    return () => {
      if (!worker.current) return;
      worker.current.stop();
      worker.current.close();
    };
  }, [geckoIds.length]);

  const state: State = {
    get rates() {
      return settings.rates;
    },
    getRate: (ticker: TTicker) => {
      // @ts-ignore until we find a solution for TS7053 error
      if (!state.rates[ticker]) return DEFAULT_FIAT_RATE;
      return settings && settings.fiatCurrency
        ? state.rates[ticker][settings.fiatCurrency.toLowerCase()]
        : DEFAULT_FIAT_RATE;
    },
    getAssetRate: (asset: Asset) => {
      const uuid = asset.uuid;
      if (!state.rates[uuid]) return DEFAULT_FIAT_RATE;
      return settings && settings.fiatCurrency
        ? state.rates[uuid][settings.fiatCurrency.toLowerCase()]
        : DEFAULT_FIAT_RATE;
    },
    getPoolAssetReserveRate: (uuid: string, assets: Asset[]) => {
      const reserveRateObject = reserveRateMapping[uuid];
      if (!reserveRateObject) return [];
      return reserveRateObject.reserveRates
        .map((item: ReserveMappingRate) => {
          const detectedReserveAsset = assets.find((asset) => asset.uuid === item.assetId);
          if (!detectedReserveAsset) return;

          return { ...detectedReserveAsset, reserveExchangeRate: item.rate };
        })
        .filter(notUndefined);
    }
  };

  return <RatesContext.Provider value={state}>{children}</RatesContext.Provider>;
}
