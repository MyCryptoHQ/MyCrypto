import React from 'react';

import { translateRaw } from 'translations';
import { TokenValue } from 'libs/units';
import removeIcon from 'assets/images/icon-remove.svg';
import { UnitDisplay } from 'components/ui';
import './TokenRow.scss';

type ToggleTrackedFn = (symbol: string) => void;

interface Props {
  balance: TokenValue;
  symbol: string;
  custom?: boolean;
  decimal: number;
  tracked: boolean;
  toggleTracked: ToggleTrackedFn | false;
  onRemove(symbol: string): void;
}
interface State {
  showLongBalance: boolean;
}

export default class TokenRow extends React.PureComponent<Props, State> {
  public state = {
    showLongBalance: false
  };

  public render() {
    const { balance, symbol, custom, decimal, tracked } = this.props;
    const { showLongBalance } = this.state;

    return (
      <tr className="TokenRow" onClick={this.handleToggleTracked}>
        {/* Only allow to toggle tracking on non custom tokens
        because the user can just remove the custom token instead */}
        {!this.props.custom &&
          this.props.toggleTracked && (
            <td className="TokenRow-toggled">
              <input type="checkbox" checked={tracked} />
            </td>
          )}
        <td
          className="TokenRow-balance"
          title={`${balance.toString()} (Double-Click)`}
          onDoubleClick={this.toggleShowLongBalance}
        >
          <span>
            <UnitDisplay
              value={balance}
              decimal={decimal}
              displayShortBalance={!showLongBalance}
              checkOffline={true}
            />
          </span>
        </td>
        <td className="TokenRow-symbol">
          {symbol}
          {!!custom && (
            <img
              src={removeIcon}
              alt={translateRaw('REMOVE')}
              className="TokenRow-symbol-remove"
              title={translateRaw('REMOVE_TOKEN')}
              onClick={this.onRemove}
              tabIndex={0}
            />
          )}
        </td>
      </tr>
    );
  }

  public toggleShowLongBalance = (e: React.FormEvent<HTMLTableDataCellElement>) => {
    e.preventDefault();
    this.setState(state => {
      return {
        showLongBalance: !state.showLongBalance
      };
    });
  };

  private onRemove = () => {
    this.props.onRemove(this.props.symbol);
  };

  private handleToggleTracked = () => {
    if (this.props.toggleTracked) {
      this.props.toggleTracked(this.props.symbol);
    }
  };
}
