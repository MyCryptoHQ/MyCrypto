import React, { Component, createContext } from 'react';

import { PollingService } from 'v2/workers';
import { IRate } from 'v2/types';

interface State {
  rates: IRate[];
  getRate(uuid: string): object | undefined;
  getAllRates(): object[];
}

export const RatesContext = createContext({} as State);

export class RatesProvider extends Component {
  public readonly worker = new PollingService(
    'https://proxy.mycryptoapi.com/cc?fsym=ETH&tsyms=USD',
    60000,
    // With this query, the API returns a single object e.g { 'USD': 276.98 }
    // @TODO: change when we accept multiple rates
    (data: { USD: string }) => {
      const rates = [{ from: 'ETH', to: 'USD', rate: data.USD }];
      this.setState({ rates });
    },
    err => console.debug('[RatesProvider]', err)
  );

  public readonly state: State = {
    rates: [],
    getRate: (name: string) => {
      const { rates } = this.state;
      const rate = rates.find(r => r.to === name);
      return rate;
    },
    getAllRates: () => {
      const { rates } = this.state;
      return rates;
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
