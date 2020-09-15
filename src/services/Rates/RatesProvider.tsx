import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { Fiats } from '@config/fiats';
import { DeFiReserveMapService } from '@services';
import { SettingsContext, StoreContext, useAssets } from '@services/Store';
import { ExtendedAsset, IRates, TTicker, TUuid } from '@types';
import { prop, uniqBy, useEffectOnce, usePromise } from '@vendor';
import { PollingService } from '@workers';

interface State {
  rates: IRates;
  reserveRateMapping: ReserveMapping;
  trackAsset(id: TUuid): void;
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

export type ReserveMapping = Record<string, ReserveMappingObject>;

const POLLING_INTERVAL = 90000;

const ASSET_RATES_URL = 'https://api.coingecko.com/api/v3/simple/price';
const buildAssetQueryUrl = (assets: string[], currencies: string[]) => `
  ${ASSET_RATES_URL}/?ids=${assets}&vs_currencies=${currencies}
`;

const fetchDeFiReserveMappingList = async (): Promise<ReserveMapping | any> =>
  DeFiReserveMapService.instance.getDeFiReserveMap();

const destructureCoinGeckoIds = (rates: IRates, assets: ExtendedAsset[]): IRates => {
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
  const { getAssetByUUID } = useAssets();
  const { settings, updateSettingsRates } = useContext(SettingsContext);
  const [reserveRateMapping, setReserveRateMapping] = useState({} as ReserveMapping);
  const worker = useRef<undefined | PollingService>();
  const accountAssets = getAssets();
  const [trackedAssets, setTrackedAssets] = useState<ExtendedAsset[]>([]);

  const currentAssets = [...accountAssets, ...trackedAssets];

  const trackAsset = (uuid: TUuid) => {
    const asset = getAssetByUUID(uuid);
    if (asset && !currentAssets.find((a) => a.uuid === uuid)) {
      setTrackedAssets((prevState) => uniqBy(prop('uuid'), [...prevState, asset]));
    }
  };

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
      buildAssetQueryUrl(geckoIds, Object.keys(Fiats)), // @todo: More elegant conversion then `DEFAULT_FIAT_RATE`
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
    reserveRateMapping,
    trackAsset
  };

  return <RatesContext.Provider value={state}>{children}</RatesContext.Provider>;
}
