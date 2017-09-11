// @flow
import './EquivalentValues.scss';
import React, { Component } from 'react';
import translate from 'translations';
import { formatNumber } from 'utils/formatters';
import { Ether } from 'libs/units';

const ratesKeys = ['BTC', 'REP', 'EUR', 'USD', 'GBP', 'CHF'];

type Props = {
  balance: Ether,
  rates: { [string]: number }
};

export default class EquivalentValues extends Component<Props> {
  render() {
    const { balance, rates } = this.props;

    return (
      <div className="EquivalentValues">
        <h5 className="EquivalentValues-title">
          {translate('sidebar_Equiv')}
        </h5>

        <ul className="EquivalentValues-values">
          {ratesKeys.map(key => {
            if (!rates[key]) return null;
            return (
              <li className="EquivalentValues-values-currency" key={key}>
                <span className="EquivalentValues-values-currency-label">
                  {key}:
                </span>
                <span className="EquivalentValues-values-currency-value">
                  {' '}{formatNumber(balance.amount.times(rates[key]))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
