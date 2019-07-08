import { TSymbol } from 'v2/types';

interface IAsset {
  symbol: TSymbol;
  name: string;
  network?: string;
}

export default IAsset;
