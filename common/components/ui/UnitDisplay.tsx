import React from 'react';
import {
  fromTokenBase,
  getDecimal,
  UnitKey,
  Wei,
  TokenValue
} from 'libs/units';
import { formatNumber as format } from 'utils/formatters';

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
  const { value, symbol, displayShortBalance } = params;

  if (!value) {
    return <span>Balance isn't available offline</span>;
  }

  const convertedValue = isEthereumUnit(params)
    ? fromTokenBase(value, getDecimal(params.unit))
    : fromTokenBase(value, params.decimal);

  let formattedValue;

  if (displayShortBalance) {
    const digits =
      typeof displayShortBalance === 'number' ? displayShortBalance : 4;
    formattedValue = format(convertedValue, digits);
    // If the formatted value was too low, display something like < 0.01
    if (parseFloat(formattedValue) === 0 && parseFloat(convertedValue) !== 0) {
      const padding = digits !== 0 ? `.${'0'.repeat(digits - 1)}1` : '';
      formattedValue = `< 0${padding}`;
    }
  } else {
    formattedValue = convertedValue;
  }

  return (
    <span>
      {formattedValue}
      {symbol ? ` ${symbol}` : ''}
    </span>
  );
};

export default UnitDisplay;
