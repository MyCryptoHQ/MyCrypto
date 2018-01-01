import { Wei, Address } from 'libs/units';
import BN from 'bn.js';
// By only dealing with Buffers / BN, dont have to mess around with cleaning strings
export interface ITransaction {
  to: Address;
  from?: Address;
  value?: Wei | null;
  data?: Buffer | null;
  gasLimit: Wei;
  gasPrice: Wei;
  nonce: BN;
  chainId: number;
  v;
  r;
  s;
}

export interface IHexStrTransaction {
  to: string;
  value: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  nonce: string;
  chainId: number;
}

export interface IHexStrWeb3Transaction {
  from: string;
  to: string;
  value: string;
  data: string;
  gas: string;
  gasPrice: string;
  nonce: string;
  chainId: number;
}
