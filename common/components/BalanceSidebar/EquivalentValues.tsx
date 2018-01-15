import * as React from 'react';
import BN from 'bn.js';
import translate from 'translations';
import { State } from 'reducers/rates';
import { rateSymbols, TFetchCCRates } from 'actions/rates';
import { TokenBalance } from 'selectors/wallet';
import { Balance } from 'libs/wallet';
import { NetworkConfig } from 'config/data';
import { ETH_DECIMAL, convertTokenBase } from 'libs/units';
import Spinner from 'components/ui/Spinner';
import UnitDisplay from 'components/ui/UnitDisplay';
import './EquivalentValues.scss';

const ALL_OPTION = 'All';

interface Props {
  balance?: Balance;
  tokenBalances?: TokenBalance[];
  rates: State['rates'];
  ratesError?: State['ratesError'];
  fetchCCRates: TFetchCCRates;
  network: NetworkConfig;
  isOffline: boolean;
}

interface CmpState {
  currency: string;
}

export default class EquivalentValues extends React.Component<Props, CmpState> {
  public state = {
    currency: ALL_OPTION
  };
  private balanceLookup: { [key: string]: Balance['wei'] | undefined } = {};
  private decimalLookup: { [key: string]: number } = {};
  private requestedCurrencies: string[] | null = null;

  public constructor(props: Props) {
    super(props);
    this.makeBalanceLookup(props);

    if (props.balance && props.tokenBalances) {
      this.fetchRates(props);
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { balance, tokenBalances, isOffline } = this.props;
    if (
      nextProps.balance !== balance ||
      nextProps.tokenBalances !== tokenBalances ||
      nextProps.isOffline !== isOffline
    ) {
      this.makeBalanceLookup(nextProps);
      this.fetchRates(nextProps);
    }
  }

  public render() {
    const { balance, tokenBalances, rates, ratesError, isOffline, network } = this.props;
    const { currency } = this.state;

    // There are a bunch of reasons why the incorrect balances might be rendered
    // while we have incomplete data that's being fetched.
    const isFetching =
      !balance || balance.isPending || !tokenBalances || Object.keys(rates).length === 0;
    // Currency exists in rates or the all option is selected
    const rateExistsOrAll = rates[currency] || currency === ALL_OPTION;

    let valuesEl;
    if (!isFetching && rateExistsOrAll && !network.isTestnet) {
      const values = this.getEquivalentValues(currency);
      valuesEl = rateSymbols.map(key => {
        if (!values[key] || key === currency) {
          return null;
        }

        return (
          <li className="EquivalentValues-values-currency" key={key}>
            <span className="EquivalentValues-values-currency-label">{key}:</span>{' '}
            <span className="EquivalentValues-values-currency-value">
              <UnitDisplay
                unit={'ether'}
                value={values[key]}
                displayShortBalance={3}
                checkOffline={true}
              />
            </span>
          </li>
        );
      });
    } else if (network.isTestnet) {
      valuesEl = (
        <div className="text-center">
          <h5 style={{ color: 'red' }}>
            On test network, equivalent values will not be displayed.
          </h5>
        </div>
      );
    } else if (ratesError) {
      valuesEl = <h5>{ratesError}</h5>;
    } else if (tokenBalances && tokenBalances.length === 0) {
      valuesEl = <h5>No tokens found!</h5>;
    } else {
      valuesEl = (
        <div className="EquivalentValues-values-loader">
          <Spinner size="x3" />
        </div>
      );
    }

    return (
      <div className="EquivalentValues">
        <h5 className="EquivalentValues-title">
          {translate('sidebar_Equiv')} for{' '}
          <select
            className="EquivalentValues-title-symbol"
            onChange={this.changeCurrency}
            value={currency}
          >
            <option value={ALL_OPTION}>All Tokens</option>
            <option value="ETH">ETH</option>
            {tokenBalances &&
              tokenBalances.map(tk => {
                if (!tk.balance || tk.balance.isZero() || !rates[tk.symbol]) {
                  return;
                }
                const sym = tk.symbol;
                return (
                  <option key={sym} value={sym}>
                    {sym}
                  </option>
                );
              })}
          </select>
        </h5>

        {isOffline ? (
          <div className="EquivalentValues-offline well well-sm">
            Equivalent values are unavailable offline
          </div>
        ) : (
          <ul className="EquivalentValues-values">{valuesEl}</ul>
        )}
      </div>
    );
  }

  private changeCurrency = (ev: React.FormEvent<HTMLSelectElement>) => {
    const currency = ev.currentTarget.value;
    this.setState({ currency });
  };

  private makeBalanceLookup(props: Props) {
    const tokenBalances = props.tokenBalances || [];
    this.balanceLookup = tokenBalances.reduce(
      (prev, tk) => {
        // Piggy-back off of this reduce to add to decimal lookup
        this.decimalLookup[tk.symbol] = tk.decimal;
        prev[tk.symbol] = tk.balance;
        return prev;
      },
      { ETH: props.balance && props.balance.wei }
    );
  }

  private fetchRates(props: Props) {
    // Duck out if we haven't gotten balances yet, or we're not going to
    if (!props.balance || !props.tokenBalances || props.isOffline) {
      return;
    }

    // First determine which currencies we're asking for
    const currencies = props.tokenBalances
      .filter(tk => !tk.balance.isZero())
      .map(tk => tk.symbol)
      .sort();

    // If it's the same currencies as we have, skip it
    if (this.requestedCurrencies && currencies.join() === this.requestedCurrencies.join()) {
      return;
    }

    // Fire off the request and save the currencies requested
    this.props.fetchCCRates(currencies);
    this.requestedCurrencies = currencies;
  }

  private getEquivalentValues(
    currency: string
  ): {
    [key: string]: BN | undefined;
  } {
    // Recursively call on all currencies
    if (currency === ALL_OPTION) {
      return ['ETH'].concat(this.requestedCurrencies || []).reduce(
        (prev, curr) => {
          const currValues = this.getEquivalentValues(curr);
          rateSymbols.forEach(sym => (prev[sym] = prev[sym].add(currValues[sym] || new BN(0))));
          return prev;
        },
        rateSymbols.reduce((prev, sym) => {
          prev[sym] = new BN(0);
          return prev;
        }, {})
      );
    }

    // Calculate rates for a single currency
    const { rates } = this.props;
    const balance = this.balanceLookup[currency];
    if (!balance || !rates[currency]) {
      return {};
    }

    // Tokens with non-ether like decimals need to be adjusted to match
    const decimal =
      this.decimalLookup[currency] === undefined ? ETH_DECIMAL : this.decimalLookup[currency];
    const adjustedBalance = convertTokenBase(balance, decimal, ETH_DECIMAL);

    return rateSymbols.reduce((prev, sym) => {
      prev[sym] = adjustedBalance.muln(rates[currency][sym]);
      return prev;
    }, {});
  }
}
