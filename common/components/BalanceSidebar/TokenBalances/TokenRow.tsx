import removeIcon from 'assets/images/icon-remove.svg';
import BN from 'bn.js';
import React from 'react';
import { fromTokenBase } from 'libs/units';
import './TokenRow.scss';
import { formatNumber } from 'utils/formatters';

interface Props {
  balance: BN;
  symbol: string;
  custom?: boolean;
  decimal: number;
  onRemove(symbol: string): void;
}
interface State {
  showLongBalance: boolean;
}

export default class TokenRow extends React.Component<Props, State> {
  public state = {
    showLongBalance: false
  };
  public render() {
    const { balance, symbol, custom, decimal } = this.props;
    const { showLongBalance } = this.state;
    const tokenStrVal = fromTokenBase({ value: balance.toString(), decimal })
      .value;
    return (
      <tr className="TokenRow">
        <td
          className="TokenRow-balance"
          title={`${balance.toString()} (Double-Click)`}
          onDoubleClick={this.toggleShowLongBalance}
        >
          {!!custom && (
            <img
              src={removeIcon}
              className="TokenRow-balance-remove"
              title="Remove Token"
              onClick={this.onRemove}
              tabIndex={0}
            />
          )}
          <span>
            {balance
              ? showLongBalance ? tokenStrVal : formatNumber(tokenStrVal)
              : '???'}
          </span>
        </td>
        <td className="TokenRow-symbol">{symbol}</td>
      </tr>
    );
  }

  public toggleShowLongBalance = (
    // TODO: don't use any
    e: any
  ) => {
    e.preventDefault();
    this.setState(state => {
      return {
        showLongBalance: !state.showLongBalance
      };
    });
  };

  public onRemove = () => {
    this.props.onRemove(this.props.symbol);
  };
}
