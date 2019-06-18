import { TSymbol } from 'v2/types';

// Until aliases are accepted as object keys this interface
// is just to remind us to use a TSymbol to get the icon.
// https://github.com/Microsoft/TypeScript/issues/1778#issuecomment-479986964
type TSymbolIcon = { [k in TSymbol]: string };

const ICONS: TSymbolIcon = {
  ETH: require('assets/images/ether.png')
};

const getSymbolIcon = (symbol: TSymbol) => {
  return (ICONS as any)[symbol];
};

export default getSymbolIcon;
