import React from 'react';
import translate from 'translations';
import { UnitDisplay, Spinner } from 'components/ui';
import Select from 'react-select';
import { TFetchCCRates, rateSymbols } from 'actions/rates';
import { chain, flatMap } from 'lodash';
import { NetworkConfig } from 'config/data';
import { State as RatesState } from 'reducers/rates';
import { TokenBalance } from 'selectors/wallet';
import { Balance } from 'libs/wallet';
import './EquivalentValues.scss';

const isFiat = (rate: string): boolean => {
  return rateSymbols.slice(0, 4).includes(rate as any);
};

interface DefaultOption {
  label: string;
  value: any;
}

interface Option {
  label: string;
  value: string;
}

interface State {
  equivalentValues: Option | DefaultOption;
  options: Option[];
}

interface Props {
  balance: Balance;
  tokenBalances: TokenBalance[];
  rates: RatesState['rates'];
  fetchCCRates: TFetchCCRates;
  ratesError: RatesState['ratesError'];
  network: NetworkConfig;
  offline: boolean;
}

class Equiv extends React.Component<Props, State> {
  private requestedCurrencies: string[] | null = null;
  public constructor(props: Props) {
    super(props);
    const { balance, tokenBalances, network } = this.props;
    this.state = {
      equivalentValues: this.defaultOption(balance, tokenBalances, network),
      options: []
    };

    if (props.balance && props.tokenBalances) {
      this.fetchRates(props);
    }
  }

  public defaultOption(balance, tokenBalances, network): DefaultOption {
    return {
      label: 'All',
      value: [{ symbol: network.unit, balance: balance.wei }, ...tokenBalances]
    };
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { balance, tokenBalances, offline } = this.props;
    if (
      nextProps.balance !== balance ||
      nextProps.tokenBalances !== tokenBalances ||
      nextProps.offline !== offline
    ) {
      const defaultOption = this.defaultOption(
        nextProps.balance,
        nextProps.tokenBalances,
        nextProps.network
      );
      const options: Option[] = [
        defaultOption,
        { label: nextProps.network.unit, value: nextProps.balance.wei },
        ...Object.values(nextProps.tokenBalances).map(token => {
          return { label: token.symbol, value: token.balance };
        })
      ];
      const equivalentValues =
        options.find(opt => opt.label === this.state.equivalentValues.label) || defaultOption;
      this.setState({
        equivalentValues,
        options
      });
      this.fetchRates(nextProps);
    }
  }

  public selectOption = equivalentValues => {
    this.setState({ equivalentValues });
  };

  public render(): JSX.Element {
    const { balance, offline, tokenBalances, rates, network, ratesError } = this.props;
    const { equivalentValues, options } = this.state;
    const isFetching =
      !balance || balance.isPending || !tokenBalances || Object.keys(rates).length === 0;

    const Value = ({ rate, value }) => (
      <div className="EquivalentValues-values-currency">
        <span className="EquivalentValues-values-currency-label">{rate}</span>{' '}
        <span className="EquivalentValues-values-currency-value">
          <UnitDisplay
            unit={'ether'}
            value={value}
            displayShortBalance={isFiat(rate) ? 2 : 3}
            checkOffline={true}
          />
        </span>
      </div>
    );

    return (
      <div className="EquivalentValues">
        <div className="EquivalentValues-header">
          <h5 className="EquivalentValues-title">{translate('sidebar_Equiv')}</h5>
          <Select
            name="equivalentValues"
            value={equivalentValues}
            options={options}
            onChange={this.selectOption}
            clearable={false}
            searchable={false}
          />
        </div>

        {offline ? (
          <div className="EquivalentValues-offline well well-sm">
            Equivalent values are unavailable offline
          </div>
        ) : network.isTestnet ? (
          <div className="text-center">
            <h5 style={{ color: 'red' }}>
              On test network, equivalent values will not be displayed.
            </h5>
          </div>
        ) : ratesError ? (
          <h5>{ratesError}</h5>
        ) : isFetching ? (
          <Spinner size="x2" />
        ) : (
          <div className="EquivalentValues-values">
            {this.generateValues(equivalentValues.label, equivalentValues.value).map((equiv, i) => (
              <Value rate={equiv.rate} value={equiv.value} key={i} />
            ))}
          </div>
        )}
      </div>
    );
  }

  private generateValues = (unit: string, balance) => {
    const { rates } = this.props;
    if (unit === 'All') {
      const allRates = Object.values(balance).map(
        value => !!rates[value.symbol] && rates[value.symbol]
      );
      const allEquivalentValues = allRates.map((rateType, i) => {
        return {
          symbol: Object.keys(rates)[i],
          equivalentValues: [
            ...Object.keys(rateType).map(rate => {
              const value =
                balance[i] && !!balance[i].balance ? balance[i].balance.muln(rateType[rate]) : null;
              return { rate, value };
            })
          ]
        };
      });
      // flatten all equivalent values for each unit (ETH, ETC, OMG, etc...) into an array
      const collection = flatMap([
        ...Object.values(allEquivalentValues).map(v => v.equivalentValues)
      ]);
      // group equivalent values by rate (USD, EUR, etc...)
      const groupedCollection = chain(collection)
        .groupBy('rate')
        .mapValues(v => Object.values(v).map(s => s.value))
        .value();
      // finally, add all the equivalent values together and return an array of objects with the sum of equivalent values for each rate
      return Object.values(groupedCollection).map((v, i) => {
        return {
          rate: Object.keys(groupedCollection)[i],
          value: v.reduce((acc, curr) => acc && curr && acc.add(curr))
        };
      });
    }
    const ratesObj = { ...rates[unit] };
    const equivValues = Object.keys(ratesObj).map(key => {
      const value = balance !== null ? balance.muln(ratesObj[key]) : null;
      return { rate: key, value };
    });
    return equivValues;
  };

  private fetchRates(props: Props) {
    const { balance, tokenBalances, offline, fetchCCRates } = props;
    // Duck out if we haven't gotten balances yet, or we're not going to
    if (!balance || !tokenBalances || offline) {
      return;
    }

    // First determine which currencies we're asking for
    const currencies = tokenBalances
      .filter(tk => !tk.balance.isZero())
      .map(tk => tk.symbol)
      .sort();

    // If it's the same currencies as we have, skip it
    if (this.requestedCurrencies && currencies.join() === this.requestedCurrencies.join()) {
      return;
    }

    // Fire off the request and save the currencies requested
    fetchCCRates(currencies);
    this.requestedCurrencies = currencies;
  }
}

export default Equiv;
