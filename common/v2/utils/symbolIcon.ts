import { TSymbol } from 'v2/types';

const ICONS = {
  ETH: require('assets/images/ether.png'),
}

const getSymbolIcon = (symbol: TSymbol) => {
  return ICONS[symbol];
}

export default getSymbolIcon;
