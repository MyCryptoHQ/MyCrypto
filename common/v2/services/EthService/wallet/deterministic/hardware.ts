import EthTx from 'ethereumjs-tx';

import { IFullWallet } from '../IWallet';
import { DeterministicWallet } from './deterministic';

export interface ChainCodeResponse {
  chainCode: string;
  publicKey: string;
}

export abstract class HardwareWallet extends DeterministicWallet implements IFullWallet {
  // Static functions can't be abstract, so implement an errorous one
  // @ts-ignore
  public static getChainCode(dpath: string): Promise<ChainCodeResponse> {
    throw new Error(`getChainCode is not implemented in ${this.constructor.name}`);
  }

  public abstract signRawTransaction(t: EthTx): Promise<Buffer>;
  public abstract signMessage(msg: string): Promise<string>;
  public abstract displayAddress(): Promise<boolean>;
  public abstract getWalletType(): string;
}
