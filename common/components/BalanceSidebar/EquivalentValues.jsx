// @flow
import React from 'react';
import translate from 'translations';
import { Link } from 'react-router';
import { formatNumber } from 'utils/formatters';
import type Big from 'bignumber.js';

type Props = {
  balance: Big,
  rates: { [string]: number }
};

export default class EquivalentValues extends React.Component {
  props: Props;

  render() {
    const { balance, rates } = this.props;

    return (
      <div>
        <h5>
          {translate('sidebar_Equiv')}
        </h5>
        <ul className="account-info">
          {rates['BTC'] &&
            <li>
              <span className="mono wrap">
                {formatNumber(balance.times(rates['BTC']))}
              </span>{' '}
              BTC
            </li>}
          {rates['REP'] &&
            <li>
              <span className="mono wrap">
                {formatNumber(balance.times(rates['REP']), 2)}
              </span>{' '}
              REP
            </li>}
          {rates['EUR'] &&
            <li>
              <span className="mono wrap">
                €{formatNumber(balance.times(rates['EUR']), 2)}
              </span>
              {' EUR'}
            </li>}
          {rates['USD'] &&
            <li>
              <span className="mono wrap">
                ${formatNumber(balance.times(rates['USD']), 2)}
              </span>
              {' USD'}
            </li>}
          {rates['GBP'] &&
            <li>
              <span className="mono wrap">
                £{formatNumber(balance.times(rates['GBP']), 2)}
              </span>
              {' GBP'}
            </li>}
          {rates['CHF'] &&
            <li>
              <span className="mono wrap">
                {formatNumber(balance.times(rates['CHF']), 2)}
              </span>{' '}
              CHF
            </li>}
        </ul>
        <Link to={'swap'} className="btn btn-primary btn-sm">
          Swap via bity
        </Link>
      </div>
    );
  }
}
