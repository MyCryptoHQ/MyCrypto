import { TAddress, TSymbol, ITxObject } from 'v2/types';

interface DexMetadata {
  input: {
    address: TAddress; // The token contract that is the base currency of our assetPair
    spender: TAddress; // The handler contract for the MYC trade contract. Prefer DEXAG_MYC_HANDLER_CONTRACT
    amount: string; // The base currency value
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
