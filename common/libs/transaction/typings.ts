import { Wei, TokenValue, Address } from 'libs/units';
import BN from 'bn.js';
// By only dealing with Buffers / BN, dont have to mess around with cleaning strings
export interface ITransaction {
  to: Address;
  value?: Wei;
  data?: Buffer;
  gasLimit: Wei;
  gasPrice: Wei;
  nonce: BN;
  chainId: number;
}

export interface ITokenTransaction {
  to: Address;
  tokenValue: TokenValue;
  gasLimit: Wei;
  gasPrice: Wei;
  nonce: BN;
  chainId: number;
}

export interface BroadcastTransactionStatus {
  isBroadcasting: boolean;
  signedTx: string;
  successfullyBroadcast: boolean;
}
