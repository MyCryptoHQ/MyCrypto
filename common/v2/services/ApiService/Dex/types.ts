import { TAddress, TSymbol, ITxObject } from 'v2/types';

interface DexMetadata {
  input: {
    address: TAddress;
    amount: string;
  };
  output: {
    address: TAddress;
  };
  source: {
    dex: string;
    price: string;
  };
  query: {
    from: TSymbol;
    to: TSymbol;
    fromAmount: string;
    dex: string;
    proxy: TAddress;
  };
}

export interface DexTrade {
  trade: Partial<ITxObject>;
  metadata: DexMetadata;
}
