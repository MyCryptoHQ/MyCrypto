import React, { Component, createContext } from 'react';
import FiatCurrencyServiceBase from 'v2/services/FiatCurrency/FiatCurrency';
import { FiatCurrency, ExtendedFiatCurrency } from 'v2/services/FiatCurrency';

interface ProviderState {
  FiatCurrencys: ExtendedFiatCurrency[];
  createFiatCurrency(FiatCurrencyData: FiatCurrency): void;
  deleteFiatCurrency(uuid: string): void;
  updateFiatCurrency(uuid: string, FiatCurrencyData: FiatCurrency): void;
}

export const FiatCurrencyContext = createContext({} as ProviderState);

const FiatCurrency = new FiatCurrencyServiceBase();

export class FiatCurrencyProvider extends Component {
  public readonly state: ProviderState = {
    FiatCurrencys: FiatCurrency.readFiatCurrencys() || [],
    createFiatCurrency: (FiatCurrencyData: FiatCurrency) => {
      FiatCurrency.createFiatCurrency(FiatCurrencyData);
      this.getFiatCurrencys();
    },
    deleteFiatCurrency: (uuid: string) => {
      FiatCurrency.deleteFiatCurrency(uuid);
      this.getFiatCurrencys();
    },
    updateFiatCurrency: (uuid: string, FiatCurrencyData: FiatCurrency) => {
      FiatCurrency.updateFiatCurrency(uuid, FiatCurrencyData);
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
    const FiatCurrencys: ExtendedFiatCurrency[] = FiatCurrency.readFiatCurrencys() || [];
    this.setState({ FiatCurrencys });
  };
}
