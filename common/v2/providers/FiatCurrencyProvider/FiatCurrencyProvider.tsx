import React, { Component, createContext } from 'react';
import FiatCurrencyServiceBase from 'v2/services/FiatCurrency/FiatCurrency';
import { FiatCurrency, ExtendedFiatCurrency } from 'v2/services/FiatCurrency';

interface ProviderState {
  fiatCurrencies: ExtendedFiatCurrency[];
  createFiatCurrency(fiatCurrencyData: FiatCurrency): void;
  deleteFiatCurrency(uuid: string): void;
  updateFiatCurrency(uuid: string, fiatCurrencyData: FiatCurrency): void;
}

export const FiatCurrencyContext = createContext({} as ProviderState);

const FiatCurrency = new FiatCurrencyServiceBase();

export class FiatCurrencyProvider extends Component {
  public readonly state: ProviderState = {
    fiatCurrencies: FiatCurrency.readFiatCurrencys() || [],
    createFiatCurrency: (fiatCurrencyData: FiatCurrency) => {
      FiatCurrency.createFiatCurrency(fiatCurrencyData);
      this.getFiatCurrencys();
    },
    deleteFiatCurrency: (uuid: string) => {
      FiatCurrency.deleteFiatCurrency(uuid);
      this.getFiatCurrencys();
    },
    updateFiatCurrency: (uuid: string, fiatCurrencyData: FiatCurrency) => {
      FiatCurrency.updateFiatCurrency(uuid, fiatCurrencyData);
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
    const fiatCurrencies: ExtendedFiatCurrency[] = FiatCurrency.readFiatCurrencys() || [];
    this.setState({ fiatCurrencies });
  };
}
