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
  unit?: UnitKey;
  decimal?: number;
  value?: TokenValue | Wei;
  symbol?: string;
  long?: boolean;
  digits?: number;
}

const UnitDisplay: React.SFC<Props> = params => {
  const { value, decimal, unit, symbol, digits, long } = params;

  if (!value) {
    return <span>???</span>;
  }

  const noDecimal = decimal === null || decimal === undefined;
  if (noDecimal && !unit) {
    throw Error(
      `Not enough parameters to convert base unit to display unit. Params given: ${JSON.stringify(
        params,
        null,
        1
      )}`
    );
  }

  const convertedValue = noDecimal
    ? fromTokenBase(value, getDecimal(unit as UnitKey))
    : fromTokenBase(value, decimal as number);

  const formattedValue = !long
    ? digits ? format(convertedValue, digits) : format(convertedValue)
    : convertedValue;

  return (
    <span>
      {formattedValue}
      {symbol ? ` ${symbol}` : ''}
    </span>
  );
};

export default UnitDisplay;
