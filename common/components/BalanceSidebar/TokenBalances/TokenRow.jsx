// @flow
import './TokenRow.scss';
import React from 'react';
import Big from 'bignumber.js';
import { formatNumber } from 'utils/formatters';
import removeIcon from 'assets/images/icon-remove.svg';

export default class TokenRow extends React.Component {
  props: {
    balance: Big,
    symbol: string,
    custom?: boolean,
    onRemove: (symbol: string) => void
  };

  state = {
    showLongBalance: false
  };
  render() {
    const { balance, symbol, custom } = this.props;
    const { showLongBalance } = this.state;
    return (
      <tr className="TokenRow">
        <td
          className="TokenRow-balance"
          title={`${balance.toString()} (Double-Click)`}
          onDoubleClick={this.toggleShowLongBalance}
        >
          {!!custom &&
            <img
              src={removeIcon}
              className="TokenRow-balance-remove"
              title="Remove Token"
              onClick={this.onRemove}
              tabIndex="0"
            />}
          <span>
            {showLongBalance ? balance.toString() : formatNumber(balance)}
          </span>
        </td>
        <td className="TokenRow-symbol">
          {symbol}
        </td>
      </tr>
    );
  }

  toggleShowLongBalance = (e: SyntheticInputEvent) => {
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
