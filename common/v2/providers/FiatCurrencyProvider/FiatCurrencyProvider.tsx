import React, { Component, createContext } from 'react';
import * as service from 'v2/services/FiatCurrency/FiatCurrency';
import { FiatCurrency, ExtendedFiatCurrency } from 'v2/services/FiatCurrency';

interface ProviderState {
  fiatCurrencies: ExtendedFiatCurrency[];
  createFiatCurrency(fiatCurrencyData: FiatCurrency): void;
  deleteFiatCurrency(uuid: string): void;
  updateFiatCurrency(uuid: string, fiatCurrencyData: FiatCurrency): void;
}

export const FiatCurrencyContext = createContext({} as ProviderState);

export class FiatCurrencyProvider extends Component {
  public readonly state: ProviderState = {
    fiatCurrencies: service.readFiatCurrencys() || [],
    createFiatCurrency: (fiatCurrencyData: FiatCurrency) => {
      service.createFiatCurrency(fiatCurrencyData);
      this.getFiatCurrencys();
    },
    deleteFiatCurrency: (uuid: string) => {
      service.deleteFiatCurrency(uuid);
      this.getFiatCurrencys();
    },
    updateFiatCurrency: (uuid: string, fiatCurrencyData: FiatCurrency) => {
      service.updateFiatCurrency(uuid, fiatCurrencyData);
      this.getFiatCurrencys();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <FiatCurrencyContext.Provider value={this.state}>{children}</FiatCurrencyContext.Provider>
    );
  }

  private getFiatCurrencys = () => {
    const fiatCurrencies: ExtendedFiatCurrency[] = service.readFiatCurrencys() || [];
    this.setState({ fiatCurrencies });
  };
}
