import Tx from 'ethereumjs-tx';

import Web3Node from 'libs/nodes/web3';
import { INode } from 'libs/nodes/INode';

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
