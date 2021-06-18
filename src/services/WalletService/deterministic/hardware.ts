import { UnsignedTransaction } from '@ethersproject/transactions';

import { IFullWallet } from '../IWallet';
import { HDWallet } from './deterministic';

export interface ChainCodeResponse {
  chainCode: string;
  publicKey: string;
}

export abstract class HardwareWallet extends HDWallet implements IFullWallet {
  public abstract signRawTransaction(t: UnsignedTransaction): Promise<Buffer>;
  public abstract signMessage(msg: string): Promise<string>;
  public abstract displayAddress(): Promise<boolean>;
  public abstract getWalletType(): string;
}
