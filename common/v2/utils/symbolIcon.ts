import { TSymbol } from 'v2/types';

type TSymbolIcon = { [s in TSymbol]?: string };

const ICONS: TSymbolIcon = {
  ETH: require('assets/images/ether.png')
};

const getSymbolIcon = (symbol: TSymbol) => {
  return ICONS[symbol];
};

export default getSymbolIcon;
