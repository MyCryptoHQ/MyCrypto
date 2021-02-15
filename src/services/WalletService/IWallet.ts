import { UnsignedTransaction } from '@ethersproject/transactions';

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
  signRawTransaction(tx: UnsignedTransaction): Promise<Buffer> | Buffer;
  signMessage(msg: string, nodeLib?: Web3Node): Promise<string> | string;
}

export type IWallet = IReadOnlyWallet | IFullWallet;
