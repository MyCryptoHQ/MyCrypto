import { Ether } from 'libs/units';
import React from 'react';
import translate from 'translations';
import { formatNumber } from 'utils/formatters';
import './EquivalentValues.scss';
import { State } from 'reducers/rates';
import { symbols, TFetchCCRates } from 'actions/rates';
import { TokenBalance } from 'selectors/wallet';

interface Props {
  balance?: Ether;
  tokenBalances?: TokenBalance[];
  rates?: State['rates'];
  ratesError?: State['ratesError'];
  fetchCCRates: TFetchCCRates;
}

export default class EquivalentValues extends React.Component<Props, {}> {
  public componentDidMount() {
    this.props.fetchCCRates();
  }

  public render() {
    const { balance, tokenBalances, rates, ratesError } = this.props;

    return (
      <div className="EquivalentValues">
        <h5 className="EquivalentValues-title">
          {translate('sidebar_Equiv')} for
          <select className="EquivalentValues-title-symbol">
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

        <ul className="EquivalentValues-values">
          {rates
            ? symbols.map(key => {
                if (!rates[key]) {
                  return null;
                }
                return (
                  <li className="EquivalentValues-values-currency" key={key}>
                    <span className="EquivalentValues-values-currency-label">
                      {key}:
                    </span>
                    <span className="EquivalentValues-values-currency-value">
                      {' '}
                      {balance
                        ? formatNumber(balance.amount.times(rates[key]))
                        : '???'}
                    </span>
                  </li>
                );
              })
            : ratesError && <h5>{ratesError}</h5>}
        </ul>
      </div>
    );
  }
}
