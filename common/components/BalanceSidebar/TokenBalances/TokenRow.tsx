import removeIcon from 'assets/images/icon-remove.svg';
import React from 'react';
import { TokenValue } from 'libs/units';
import { UnitDisplay } from 'components/ui';
import './TokenRow.scss';

interface Props {
  balance: TokenValue;
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
            <UnitDisplay value={balance} decimal={decimal} displayShortBalance={!showLongBalance} />
          </span>
        </td>
        <td className="TokenRow-symbol">{symbol}</td>
      </tr>
    );
  }

  public toggleShowLongBalance = (e: React.SyntheticEvent<HTMLTableDataCellElement>) => {
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
