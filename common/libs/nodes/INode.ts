import { IRPCProvider } from 'mycrypto-shepherd/dist/lib/types';
import { Token } from 'shared/types/network';
import { TokenValue } from 'libs/units';

export interface TxObj {
  to: string;
  data: string;
}

interface TokenBalanceResult {
  balance: TokenValue;
  error: string | null;
}

// alias for compatibility
export type INode = IRPCProvider & {
  getTokenBalance(address: string, token: Token): Promise<TokenBalanceResult>;
  getTokenBalances(address: string, tokens: Token[]): Promise<TokenBalanceResult[]>;
};
