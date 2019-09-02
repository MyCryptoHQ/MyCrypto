import React, { Component, createContext } from 'react';

import { PollingService } from 'v2/workers';
import { IRates, TTicker } from 'v2/types';

interface State {
  rates: IRates;
  getRate(ticker: TTicker): number | undefined;
}

const RATES_URL = 'https://proxy.mycryptoapi.com/cc/multi';
const POLLING_INTERRVAL = 60000;
const buildQueryUrl = (assets: TTicker[], currencies: TTicker[]) => `
  ${RATES_URL}/?fsyms=${assets.join(',')}&tsyms=${currencies.join(',')}
`;

export const RatesContext = createContext({} as State);

export class RatesProvider extends Component {
  public readonly worker = new PollingService(
    buildQueryUrl(['ETH' as TTicker], ['USD', 'EUR'] as TTicker[]),
    POLLING_INTERRVAL,
    // With this query, the API returns a single object e.g { 'USD': 276.98 }
    // @TODO: change when we accept multiple rates
    (data: IRates) => {
      // const rates = [{ from: 'ETH', to: 'USD', rate: data.USD }];
      this.setState({ rates: data });
    },
    err => console.debug('[RatesProvider]', err)
  );

  public readonly state: State = {
    rates: {},
    getRate: (ticker: TTicker) => {
      const { rates } = this.state;
      // @ts-ignore until we find a solution for TS7053 error
      const rate = rates[ticker] ? rates[ticker].USD : 1;
      return rate;
    }
  };

  public componentDidMount() {
    this.worker.start();
  }

  // Make sure to terminate the worker before the component unmounts
  public componentWillUnmount() {
    this.worker.stop();
    this.worker.close();
  }

  public render() {
    const { children } = this.props;
    return <RatesContext.Provider value={this.state}>{children}</RatesContext.Provider>;
  }
}
