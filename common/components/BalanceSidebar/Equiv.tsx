import React from 'react';
import translate from 'translations';
import { UnitDisplay, Spinner } from 'components/ui';
import Select from 'react-select';
import './Equiv.scss';
import { TFetchCCRates } from 'actions/rates';

interface Option {
  label: string;
  value: string;
}

interface State {
  equivalentValues: Option;
}

interface Props {
  rates: any;
  balance: any;
  network: any;
  offline: boolean;
  tokenBalances: any;
  fetchCCRates: TFetchCCRates;
}

const defaultOption = {
  label: 'All',
  value: 'all'
};

class Equiv extends React.Component<any, any> {
  private requestedCurrencies: string[] | null = null;

  public constructor(props: Props) {
    super(props);
    this.state = {
      equivalentValues: defaultOption
    };

    if (props.balance && props.tokenBalances) {
      this.fetchRates(props);
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { balance, tokenBalances, offline } = this.props;
    if (
      nextProps.balance !== balance ||
      nextProps.tokenBalances !== tokenBalances ||
      nextProps.offline !== offline
    ) {
      // this.makeBalanceLookup(nextProps);
      this.fetchRates(nextProps);
    }
  }

  public selectOption = equivalentValues => {
    this.setState({ equivalentValues });
  };

  public render(): JSX.Element {
    const { balance, offline, network, tokenBalances } = this.props;
    const { equivalentValues } = this.state;

    const options: Option[] = [
      defaultOption,
      { label: network.unit, value: balance.wei },
      ...Object.values(tokenBalances).map(token => {
        return { label: token.symbol, value: token.balance };
      })
    ].filter(equivalent => {
      return equivalent.value !== equivalentValues.value;
    });

    const Value = ({ rate, value }) => (
      <div className="EquivalentValues-values-currency">
        <span className="EquivalentValues-values-currency-label">{rate}</span>{' '}
        <span className="EquivalentValues-values-currency-value">
          <UnitDisplay unit={'ether'} value={value} displayShortBalance={3} checkOffline={true} />
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
        ) : balance.isPending ? (
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
    const ratesObj = { ...rates[unit] };
    const equivValues = Object.keys(ratesObj).map(key => {
      const value = balance !== null ? balance.muln(ratesObj[key]) : null;
      return { unit, rate: key, value };
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
