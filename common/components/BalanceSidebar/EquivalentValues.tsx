import React from 'react';
import translate from 'translations';
import './EquivalentValues.scss';
import { State } from 'reducers/rates';
import { symbols } from 'actions/rates';
import { UnitDisplay } from 'components/ui';
import { Balance } from 'libs/wallet';
import Spinner from 'components/ui/Spinner';

interface Props {
  balance: Balance;
  rates?: State['rates'];
  ratesError?: State['ratesError'];
}

export default class EquivalentValues extends React.Component<Props, {}> {
  public render() {
    const { balance, rates, ratesError } = this.props;

    return (
      <div className="EquivalentValues">
        <h5 className="EquivalentValues-title">{translate('sidebar_Equiv')}</h5>

        <ul className="EquivalentValues-values">
          {rates
            ? symbols.map(key => {
                if (!rates[key]) {
                  return null;
                }
                return (
                  <li className="EquivalentValues-values-currency" key={key}>
                    <span className="EquivalentValues-values-currency-label">
                      {key + ': '}
                    </span>
                    <span className="EquivalentValues-values-currency-value">
                      {balance.isPending ? (
                        <Spinner />
                      ) : (
                        <UnitDisplay
                          unit={'ether'}
                          value={
                            balance.wei ? balance.wei.muln(rates[key]) : null
                          }
                          displayShortBalance={2}
                        />
                      )}
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
