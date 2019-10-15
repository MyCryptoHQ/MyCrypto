import React, { createContext, useContext, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { StoreContext, AccountContext, SettingsContext } from 'v2/services/Store';
import { PollingService } from 'v2/workers';
import { IRates, TTicker } from 'v2/types';

interface State {
  rates: IRates;
  getRate(ticker: TTicker): number | undefined;
}

const DEFAULT_FIAT_PAIRS = ['USD', 'EUR'] as TTicker[];
const DEFAULT_FIAT_RATE = 0;
const POLLING_INTERRVAL = 60000;
const RATES_URL = 'https://proxy.mycryptoapi.com/cc/multi';
const buildQueryUrl = (assets: TTicker[], currencies: TTicker[]) => `
  ${RATES_URL}/?fsyms=${assets.join(',')}&tsyms=${currencies.join(',')}
`;

export const RatesContext = createContext({} as State);
export function RatesProvider({ children }: { children: React.ReactNode }) {
  const { accounts: rawAccounts } = useContext(AccountContext);
  const { assetTickers } = useContext(StoreContext);
  const { settings, updateSettingsRates } = useContext(SettingsContext);
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

  useEffect(() => {
    // The cryptocompare api that our proxie uses fails gracefully and will return a conversion rate
    // even if some are tickers are invalid (e.g WETH, GoerliETH etc.)
    const currentTickers = assetTickers();
    const worker = new PollingService(
      buildQueryUrl(currentTickers, DEFAULT_FIAT_PAIRS), // @TODO: figure out how to handle the conversion more elegantly then `DEFAULT_FIAT_RATE`
      POLLING_INTERRVAL,
      (data: IRates) => setRates(data),
      err => console.debug('[RatesProvider]', err)
    );

    const terminateWorker = () => {
      worker.stop();
      worker.close();
    };

    worker.start();
    return terminateWorker; // make sure we terminate the previous worker on teardown.
  }, [rawAccounts]); // only update if an account has been added or removed from LocalStorage.

  const state: State = {
    rates: {},
    getRate: (ticker: TTicker) => {
      // @ts-ignore until we find a solution for TS7053 error
      return rates[ticker] ? rates[ticker].USD : DEFAULT_FIAT_RATE;
    }
  };

  return <RatesContext.Provider value={state}>{children}</RatesContext.Provider>;
}
