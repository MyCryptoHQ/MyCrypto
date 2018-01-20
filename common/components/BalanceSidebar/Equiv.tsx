import React from 'react';
import translate from 'translations';
import { UnitDisplay, Spinner } from 'components/ui';
import Select from 'react-select';
import './Equiv.scss';
import { TFetchCCRates, rateSymbols } from 'actions/rates';
import { chain, flatMap } from 'lodash';

const isFiat = (rate: string): boolean => {
  return rateSymbols.slice(0, 4).includes(rate as any);
};

interface Option {
  label: string;
  value: string;
}

interface State {
  equivalentValues: Option;
  options: Option[];
}

interface Props {
  rates: any;
  balance: any;
  network: any;
  offline: boolean;
  tokenBalances: any;
  fetchCCRates: TFetchCCRates;
}

class Equiv extends React.Component<any, any> {
  private requestedCurrencies: string[] | null = null;
  public constructor(props: Props) {
    super(props);
    const { balance, tokenBalances, network } = this.props;
    this.state = {
      equivalentValues: this.defaultOption(balance, tokenBalances, network),
      options: null
    };

    if (props.balance && props.tokenBalances) {
      this.fetchRates(props);
    }
  }

  public defaultOption(balance, tokenBalances, network) {
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
      // this.makeBalanceLookup(nextProps);
      const options: Option[] = [
        this.defaultOption(nextProps.balance, nextProps.tokenBalances, nextProps.network),
        { label: nextProps.network.unit, value: nextProps.balance.wei },
        ...Object.values(nextProps.tokenBalances).map(token => {
          return { label: token.symbol, value: token.balance };
        })
      ];
      const equivalentValues = options.find(opt => opt.label === this.state.equivalentValues.label);
      console.log(equivalentValues, options);
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
    const { balance, offline, network, tokenBalances, rates } = this.props;
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

  private generateValues = (unit, balance) => {
    const { rates } = this.props;
    // TODO: Clean this up, add comments to clarify
    if (unit === 'All') {
      const allRates = Object.values(balance).map(
        value => !!rates[value.symbol] && rates[value.symbol]
      );
      const vals = allRates.map((rateType, i) => {
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
      const collection = flatMap([...Object.values(vals).map(v => v.equivalentValues)]);
      const o = chain(collection)
        .groupBy('rate')
        .mapValues(v => Object.values(v).map(s => s.value))
        .value();
      return Object.values(o).map((v, i) => {
        return {
          rate: Object.keys(o)[i],
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
