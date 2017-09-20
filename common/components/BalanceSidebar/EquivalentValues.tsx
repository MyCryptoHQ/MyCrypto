import { Ether } from 'libs/units';
import React from 'react';
import translate from 'translations';
import { formatNumber } from 'utils/formatters';
import './EquivalentValues.scss';

const ratesKeys = ['BTC', 'REP', 'EUR', 'USD', 'GBP', 'CHF'];

interface Props {
  balance?: Ether;
  rates?: { [key: string]: number };
}

export default class EquivalentValues extends React.Component<Props, {}> {
  public render() {
    const { balance, rates } = this.props;

    return (
      <div className="EquivalentValues">
        <h5 className="EquivalentValues-title">
          {translate('sidebar_Equiv')}
        </h5>

        <ul className="EquivalentValues-values">
          {rates
            ? ratesKeys.map(key => {
                if (!rates[key]) {
                  return null;
                }
                return (
                  <li className="EquivalentValues-values-currency" key={key}>
                    <span className="EquivalentValues-values-currency-label">
                      {key}:
                    </span>
                    <span className="EquivalentValues-values-currency-value">
                      {' '}{balance
                        ? formatNumber(balance.amount.times(rates[key]))
                        : '???'}
                    </span>
                  </li>
                );
              })
            : <h5>No rates were loaded.</h5>}
        </ul>
      </div>
    );
  }
}
