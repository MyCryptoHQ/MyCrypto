import removeIcon from 'assets/images/icon-remove.svg';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { formatNumber } from 'utils/formatters';
import './TokenRow.scss';

interface Props {
  balance: BigNumber;
  symbol: string;
  custom?: boolean;
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
              tabIndex={0}
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

  public toggleShowLongBalance = (
    e: React.SyntheticEvent<HTMLInputElement>
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
