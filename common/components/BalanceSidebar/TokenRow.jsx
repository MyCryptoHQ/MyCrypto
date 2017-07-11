// @flow
import React from 'react';
import Big from 'big.js';
import translate from 'translations';
import { formatNumber } from 'utils/formatters';

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
    return (
      <tr>
        <td
          className="mono wrap point"
          title={`${balance.toString()} (Double-Click)`}
          onDoubleClick={this.toggleShowLongBalance}
        >
          {!!custom &&
            <img
              src="images/icon-remove.svg"
              className="token-remove"
              title="Remove Token"
              onClick={this.onRemove}
            />}
          <span>
            {this.state.showLongBalance ? balance.toString() : formatNumber(balance)}
          </span>
        </td>
        <td>
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
