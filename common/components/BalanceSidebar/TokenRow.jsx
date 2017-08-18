// @flow
import React, { Component } from 'react';
import Big from 'bignumber.js';

import { formatNumber } from 'utils/formatters';
import removeIcon from 'assets/images/icon-remove.svg';

type Props = {
  balance: Big,
  symbol: string,
  custom?: boolean,
  onRemove: (symbol: string) => void
};

type State = {
  showLongBalance: boolean
};

export default class TokenRow extends Component<Props, State> {
  state = {
    showLongBalance: false
  };

  render() {
    const { balance, symbol, custom } = this.props;
    const { showLongBalance } = this.state;
    return (
      <tr>
        <td
          className="mono wrap point"
          title={`${balance.toString()} (Double-Click)`}
          onDoubleClick={this.toggleShowLongBalance}
        >
          {!!custom &&
            <img
              src={removeIcon}
              className="token-remove"
              title="Remove Token"
              onClick={this.onRemove}
            />}
          <span>
            {showLongBalance ? balance.toString() : formatNumber(balance)}
          </span>
        </td>
        <td>
          {symbol}
        </td>
      </tr>
    );
  }

  toggleShowLongBalance = (e: SyntheticInputEvent<*>) => {
    e.preventDefault();
    this.setState(state => {
      return {
        showLongBalance: !state.showLongBalance
      };
    });
  };

  onRemove = () => {
    this.props.onRemove(this.props.symbol);
  };
}
