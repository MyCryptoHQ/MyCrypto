import { Transaction as Tx } from 'ethereumjs-tx';

import { INode } from '@types';
import { Web3Node } from '@services/EthService';

interface IBaseWallet {
  isReadOnly?: boolean;
  getAddressString(): string;
  getPrivateKeyString?(): string;
}

export interface IReadOnlyWallet extends IBaseWallet {
  isReadOnly: true;
}

export interface IFullWallet extends IBaseWallet {
  isReadOnly?: false;
  signRawTransaction(tx: Tx): Promise<Buffer> | Buffer;
  signMessage(msg: string, nodeLib: Web3Node | INode): Promise<string> | string;
}

export type IWallet = IReadOnlyWallet | IFullWallet;
