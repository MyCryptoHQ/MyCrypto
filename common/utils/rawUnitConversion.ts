import { fromTokenBase, getDecimalFromEtherUnit, TokenValue, Wei, UnitKey } from 'libs/units';

interface Args {
  value?: TokenValue | Wei | null;
  symbol?: string;
}

interface EthProps extends Args {
  unit: UnitKey;
}
interface TokenProps extends Args {
  decimal: number;
}

// export const rawUnitConversion = (args: Args & (EthProps | TokenProps)) => {
export const rawUnitConversion = (args: Args & (EthProps | TokenProps)) => {
  const { value } = args;
  const isEthereumUnit = !!(args as EthProps).unit;
  return value
    ? isEthereumUnit
      ? fromTokenBase(value, getDecimalFromEtherUnit((args as EthProps).unit))
      : fromTokenBase(value, (args as TokenProps).decimal)
    : '';
};
