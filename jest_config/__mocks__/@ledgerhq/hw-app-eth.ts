import { HDNode } from '@ethersproject/hdnode';
import type { Transaction } from '@ethersproject/transactions';
import { parse } from '@ethersproject/transactions';
import { Wallet } from '@ethersproject/wallet';

import { addHexPrefix } from '@utils';

const hdNode = HDNode.fromMnemonic('test test test test test test test test test test test ball');

const EthereumApp = jest.fn().mockImplementation(() => ({
  getAddress: jest.fn().mockImplementation(async (path) => {
    const childNode = hdNode.derivePath(path);
    return {
      address: childNode.address,
      publicKey: childNode.publicKey,
      chainCode: childNode.chainCode
    };
  }),

  signTransaction: jest.fn().mockImplementation(async (path, transaction) => {
    const childNode = hdNode.derivePath(path);
    const wallet = new Wallet(childNode.privateKey);

    const { v: unusedV, r: unusedR, s: unusedS, type, ...tx } = parse(addHexPrefix(transaction));

    const signedTransaction = await wallet.signTransaction(tx);
    const { v, r, s } = parse(signedTransaction) as Required<Transaction>;

    return {
      v: addHexPrefix(v.toString(16)),
      r,
      s
    };
  })
}));

export default EthereumApp;
