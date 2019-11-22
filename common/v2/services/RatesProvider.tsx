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
  Object.keys(rates).forEach(rateKey => {
    const rateObject = rates[rateKey];
    delete rates[rateKey];
    const detectedAssetUUID = Object.keys(assetMap)
      .filter(assetMapKey => assetMap[assetMapKey].coinGeckoId)
      .find(assetMapKey => assetMap[assetMapKey].coinGeckoId === rateKey);
    if (detectedAssetUUID) {
      rates[detectedAssetUUID] = rateObject;
    }
  });
  return rates;
};

const pullCoinGeckoIDs = (assetMap: AssetMappingListObject, uuids: string[]): string[] =>
  uuids
    .map((uuid: string) => (!assetMap || !assetMap[uuid] ? undefined : assetMap[uuid].coinGeckoId))
    .filter(notUndefined);

export const RatesContext = createContext({} as State);
export function RatesProvider({ children }: { children: React.ReactNode }) {
  const { accounts: rawAccounts } = useContext(AccountContext);
  const { assetIDs } = useContext(StoreContext);
  const { settings, updateSettingsRates } = useContext(SettingsContext);
  const { getNetworkByName } = useContext(NetworkContext);
  const [rates, setRates] = useState(settings.rates || {});
  const [isSettingsInitialized, setIsSettingsInitialized] = useState(false);
  useEffect(() => {
    if (isEmpty(rates) || isSettingsInitialized) return;
    updateSettingsRates(rates);
    setIsSettingsInitialized(true);
  }, [rates, isSettingsInitialized]);

  useEffect(() => {
    // Save settings rates again when the assets change.
    setIsSettingsInitialized(false);
  }, [Object.keys(rates)]);
  const currentAssetIDs = assetIDs();
  useEffect(() => {
    // The cryptocompare api that our proxie uses fails gracefully and will return a conversion rate
    // even if some are tickers are invalid (e.g WETH, GoerliETH etc.)
    fetchAssetMappingList().then((coinMappingObj: AssetMappingListObject) => {
      const formattedCoinGeckoIds = pullCoinGeckoIDs(coinMappingObj, currentAssetIDs as string[]);
      const worker = new PollingService(
        buildTokenQueryUrl(formattedCoinGeckoIds, DEFAULT_FIAT_PAIRS), // @TODO: figure out how to handle the conversion more elegantly then `DEFAULT_FIAT_RATE`
        POLLING_INTERRVAL,
        (data: IRates) => setRates({ ...rates, ...destructureCoinGeckoIds(data, coinMappingObj) }),
        err => console.debug('[RatesProvider]', err)
      );

      const terminateWorker = () => {
        worker.stop();
        worker.close();
      };

      worker.start();
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
