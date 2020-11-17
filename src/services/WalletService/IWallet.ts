import { UnsignedTransaction } from 'ethers/utils';

import { Web3Node } from '@services/EthService';
import { INode } from '@types';

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
  signRawTransaction(tx: UnsignedTransaction): Promise<Buffer> | Buffer;
  signMessage(msg: string, nodeLib: Web3Node | INode): Promise<string> | string;
}

export type IWallet = IReadOnlyWallet | IFullWallet;
