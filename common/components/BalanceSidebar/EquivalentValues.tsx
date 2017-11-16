import * as React from 'react';
import translate from 'translations';
import { State } from 'reducers/rates';
import { rateSymbols, TFetchCCRates } from 'actions/rates';
import { TokenBalance } from 'selectors/wallet';
import { Balance } from 'libs/wallet';
import Spinner from 'components/ui/Spinner';
import UnitDisplay from 'components/ui/UnitDisplay';
import './EquivalentValues.scss';

interface Props {
  balance?: Balance;
  tokenBalances?: TokenBalance[];
  rates: State['rates'];
  ratesError?: State['ratesError'];
  fetchCCRates: TFetchCCRates;
}

interface CmpState {
  currency: string;
}

export default class EquivalentValues extends React.Component<Props, CmpState> {
  public state = {
    currency: 'ETH'
  };
  private balanceLookup = {};

  public constructor(props) {
    super(props);
    this.makeBalanceLookup(props);
  }

  public componentDidMount() {
    this.props.fetchCCRates(this.state.currency);
  }

  public componentWillReceiveProps(nextProps) {
    const { balance, tokenBalances } = this.props;
    if (
      nextProps.balance !== balance ||
      nextProps.tokenBalances !== tokenBalances
    ) {
      this.makeBalanceLookup(nextProps);
    }
  }

  public render() {
    const { tokenBalances, rates, ratesError } = this.props;
    const { currency } = this.state;
    const balance = this.balanceLookup[currency];

    let values;
    if (balance && rates && rates[currency]) {
      values = rateSymbols.map(key => {
        if (!rates[currency][key] || key === currency) {
          return null;
        }

        return (
          <li className="EquivalentValues-values-currency" key={key}>
            <span className="EquivalentValues-values-currency-label">
              {key}:
            </span>{' '}
            <span className="EquivalentValues-values-currency-value">
              {balance.isPending ? (
                <Spinner />
              ) : (
                <UnitDisplay
                  unit={'ether'}
                  value={balance ? balance.muln(rates[currency][key]) : null}
                  displayShortBalance={2}
                />
              )}
            </span>
          </li>
        );
      });
    } else if (ratesError) {
      values = <h5>{ratesError}</h5>;
    } else {
      values = (
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
            <option value="ETH">ETH</option>
            {tokenBalances &&
              tokenBalances.map(tk => {
                if (!tk.balance || tk.balance.isZero()) {
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

        <ul className="EquivalentValues-values">{values}</ul>
      </div>
    );
  }

  private changeCurrency = (ev: React.FormEvent<HTMLSelectElement>) => {
    const currency = ev.currentTarget.value;
    this.setState({ currency });
    if (!this.props.rates || !this.props.rates[currency]) {
      this.props.fetchCCRates(currency);
    }
  };

  private makeBalanceLookup(props: Props) {
    const tokenBalances = props.tokenBalances || [];
    this.balanceLookup = tokenBalances.reduce(
      (prev, tk) => {
        return {
          ...prev,
          [tk.symbol]: tk.balance
        };
      },
      { ETH: props.balance && props.balance.wei }
    );
  }
}
