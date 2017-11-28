import React from 'react';
import { connect } from 'react-redux';
import {
  fromTokenBase,
  getDecimal,
  UnitKey,
  Wei,
  TokenValue
} from 'libs/units';
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
  /**
   * @description From redux store, whether or not the user is currently offline
   * @type {boolean}
   * @memberof Props
   */
  offline?: boolean;
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
  const { value, symbol, displayShortBalance, offline } = params;

  if (offline) {
    return <span>Balance isn't available offline</span>;
  } else if (!value) {
    return <Spinner size="x1" />;
  }

  const convertedValue = isEthereumUnit(params)
    ? fromTokenBase(value, getDecimal(params.unit))
    : fromTokenBase(value, params.decimal);

  let formattedValue;

  if (displayShortBalance) {
    const digits =
      typeof displayShortBalance === 'number' && displayShortBalance;
    formattedValue = digits
      ? format(convertedValue, digits)
      : format(convertedValue);
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

function mapStateToProps(state: AppState) {
  return {
    offline: getOffline(state)
  };
}

export default connect(mapStateToProps)(UnitDisplay);
