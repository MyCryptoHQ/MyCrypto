import React, { createContext, useContext, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { StoreContext, AccountContext, SettingsContext } from 'v2/services/Store';
import { PollingService } from 'v2/workers';
import { IRates, TTicker } from 'v2/types';

interface State {
  rates: IRates;
  getRate(ticker: TTicker): number | undefined;
}

interface CoinGeckoListObject {
  id: string;
  symbol: string;
  name: string;
}

const DEFAULT_FIAT_PAIRS = ['USD', 'EUR'] as TTicker[];
const DEFAULT_FIAT_RATE = 0;
const POLLING_INTERRVAL = 60000;
//const RATES_URL = 'https://proxy.mycryptoapi.com/cc/multi'
const ASSET_ID_LIST_URL = 'https://api.coingecko.com/api/v3/coins/list';
const TOKEN_RATES_URL = 'https://api.coingecko.com/api/v3/simple/price';
/*const buildQueryUrl = (assets: TTicker[], currencies: TTicker[]) => `
  ${RATES_URL}/?fsyms=${assets.join(',')}tsyms=${currencies.join(',')}
`;*/
const buildTokenQueryUrl = (assets: TTicker[], currencies: TTicker[]) => `
  ${TOKEN_RATES_URL}/?ids=${assets.join('%2C')}&vs_currencies=${currencies.join('%2c')}
`;

const fetchCoinGeckoCoinlist = async () => {
  const assetIdList = await fetch(ASSET_ID_LIST_URL);
  return await assetIdList.json();
};

const structureCoinGeckoTickers = (coinGeckoCoinlist: CoinGeckoListObject[], tickers: string[]) => {
  return tickers.map(ticker => {
    const detectedCoinListObject = coinGeckoCoinlist.find(
      (coinListObj: CoinGeckoListObject) =>
        coinListObj.symbol.toLowerCase() === ticker.toLowerCase()
    );
    return detectedCoinListObject ? detectedCoinListObject.id : ticker;
  });
};

const destructureCoinGeckoTickers = (rates: IRates, coinGeckoCoinlist: CoinGeckoListObject[]) => {
  Object.keys(rates).forEach(rateID => {
    const coinGeckoObj = coinGeckoCoinlist.find(
      (coinListObj: CoinGeckoListObject) => coinListObj.id.toLowerCase() === rateID.toLowerCase()
    );
    if (coinGeckoObj) {
      rates[coinGeckoObj.symbol.toUpperCase()] = rates[coinGeckoObj.id];
      delete rates[coinGeckoObj.id];
    }
  });
  return rates;
};

export const RatesContext = createContext({} as State);
export function RatesProvider({ children }: { children: React.ReactNode }) {
  const { accounts: rawAccounts } = useContext(AccountContext);
  const { assetTickers } = useContext(StoreContext);
  const { settings, updateSettingsRates } = useContext(SettingsContext);
  const [rates, setRates] = useState(settings.rates || {});
  const [isSettingsInitialized, setIsSettingsInitialized] = useState(false);
  /*

  */
  useEffect(() => {
    if (isEmpty(rates) || isSettingsInitialized) return;
    updateSettingsRates(rates);
    setIsSettingsInitialized(true);
  }, [rates, isSettingsInitialized]);

  useEffect(() => {
    // Save settings rates again when the assets change.
    setIsSettingsInitialized(false);
  }, [Object.keys(rates)]);
  const currentTickers = assetTickers();
  useEffect(() => {
    // The cryptocompare api that our proxie uses fails gracefully and will return a conversion rate
    // even if some are tickers are invalid (e.g WETH, GoerliETH etc.)
    fetchCoinGeckoCoinlist().then((coinListObjs: CoinGeckoListObject[]) => {
      const formattedTickers = structureCoinGeckoTickers(coinListObjs, currentTickers as string[]);
      const worker = new PollingService(
        buildTokenQueryUrl(formattedTickers, DEFAULT_FIAT_PAIRS), // @TODO: figure out how to handle the conversion more elegantly then `DEFAULT_FIAT_RATE`
        POLLING_INTERRVAL,
        (data: IRates) => setRates({ rates, ...destructureCoinGeckoTickers(data, coinListObjs) }),
        err => console.debug('[RatesProvider]', err)
      );

      const terminateWorker = () => {
        worker.stop();
        worker.close();
      };

      worker.start();
      return terminateWorker; // make sure we terminate the previous worker on teardown.
    });
  }, [rawAccounts]); // only update if an account has been added or removed from LocalStorage.

  const state: State = {
    rates: {},
    getRate: (ticker: TTicker) => {
      // @ts-ignore until we find a solution for TS7053 error
      return rates[ticker] ? rates[ticker].usd : DEFAULT_FIAT_RATE;
    }
  };

  return <RatesContext.Provider value={state}>{children}</RatesContext.Provider>;
}
