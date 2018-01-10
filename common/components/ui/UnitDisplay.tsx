import React from 'react';
import { connect } from 'react-redux';
import { fromTokenBase, getDecimalFromEtherUnit, UnitKey, Wei, TokenValue } from 'libs/units';
import { formatNumber as format } from 'utils/formatters';
import Spinner from 'components/ui/Spinner';
import { getOffline } from 'selectors/config';
import { AppState } from 'reducers';

interface Props {
  /**
   * @description base value of the token / ether, incase of waiting for API calls, we can return '???'
   * @type {TokenValue | Wei}
   * @memberof Props
   */
  value?: TokenValue | Wei | null;
  /**
   * @description Symbol to display to the right of the value, such as 'ETH'
   * @type {string}
   * @memberof Props
   */
  symbol?: string;
  /**
   * @description display the long balance, if false, trims it to 3 decimal places, if a number is specified then that number is the number of digits to be displayed.
   * @type {boolean}
   * @memberof Props
   */
  displayShortBalance?: boolean | number;
  displayTrailingZeroes?: boolean;
  checkOffline?: boolean;
}

interface EthProps extends Props {
  unit: UnitKey;
}
interface TokenProps extends Props {
  decimal: number;
}

const isEthereumUnit = (param: EthProps | TokenProps): param is EthProps =>
  !!(param as EthProps).unit;

const UnitDisplay: React.SFC<EthProps | TokenProps> = params => {
  const { value, symbol, displayShortBalance, displayTrailingZeroes, checkOffline } = params;
  let element;

  if (!value) {
    element = <Spinner size="x1" />;
  } else {
    const convertedValue = isEthereumUnit(params)
      ? fromTokenBase(value, getDecimalFromEtherUnit(params.unit))
      : fromTokenBase(value, params.decimal);

    let formattedValue;

    if (displayShortBalance) {
      const digits = typeof displayShortBalance === 'number' ? displayShortBalance : 4;
      formattedValue = format(convertedValue, digits);
      // If the formatted value was too low, display something like < 0.01
      if (parseFloat(formattedValue) === 0 && parseFloat(convertedValue) !== 0) {
        const padding = digits !== 0 ? `.${'0'.repeat(digits - 1)}1` : '';
        formattedValue = `< 0${padding}`;
      } else if (displayTrailingZeroes) {
        const [whole, deci] = formattedValue.split('.');
        formattedValue = `${whole}.${(deci || '').padEnd(digits, '0')}`;
      }
    } else {
      formattedValue = convertedValue;
    }

    element = (
      <span>
        {formattedValue}
        {symbol ? ` ${symbol}` : ''}
      </span>
    );
  }

  return checkOffline ? <ConnectedOfflineDisplay>{element}</ConnectedOfflineDisplay> : element;
};

export default UnitDisplay;

/**
 * @description Helper component for displaying alternate text when offline.
 * Circumvents typescript issue with union props on connected components.
 */
interface OfflineProps {
  offline: AppState['config']['offline'];
  children: React.ReactElement<string>;
}

class OfflineDisplay extends React.Component<OfflineProps> {
  public render() {
    if (this.props.offline) {
      return <span>Balance isn't available offline</span>;
    } else {
      return this.props.children;
    }
  }
}

function mapStateToOfflineProps(state: AppState) {
  return {
    offline: getOffline(state)
  };
}

const ConnectedOfflineDisplay = connect(mapStateToOfflineProps)(OfflineDisplay);
