import { HDNode } from '@ethersproject/hdnode';
import { computePublicKey } from '@ethersproject/signing-key';
import type { Transaction } from '@ethersproject/transactions';
import { parse } from '@ethersproject/transactions';
import { Wallet } from '@ethersproject/wallet';
import type { EthereumTransaction } from 'trezor-connect';

import { addHexPrefix } from '@utils';

const hdNode = HDNode.fromMnemonic('test test test test test test test test test test test ball');

export default {
  manifest: jest.fn(),
  getPublicKey: jest
    .fn()
    .mockImplementation(({ path, bundle }: { path: string; bundle: { path: string }[] }) => {
      if (bundle) {
        return {
          success: true,
          payload: bundle.map(({ path }) => {
            const childNode = hdNode.derivePath(path);
            return {
              serializedPath: path,
              publicKey: computePublicKey(childNode.publicKey, false),
              chainCode: childNode.chainCode
            };
          })
        };
      }
      const childNode = hdNode.derivePath(path);
      return {
        success: true,
        payload: {
          publicKey: computePublicKey(childNode.publicKey, false),
          chainCode: childNode.chainCode
        }
      };
    }),

  ethereumGetAddress: jest.fn().mockImplementation(({ path }: { path: string }) => {
    const childNode = hdNode.derivePath(path);
    return {
      success: true,
      payload: {
        address: childNode.address
      }
    };
  }),

  ethereumSignTransaction: jest
    .fn()
    .mockImplementation(
      async ({ path, transaction }: { path: string; transaction: EthereumTransaction }) => {
        const childNode = hdNode.derivePath(path);
        const wallet = new Wallet(childNode.privateKey);

        const signedTransaction = await wallet.signTransaction(transaction);
        const { v, r, s } = parse(signedTransaction) as Required<Transaction>;

        return {
          success: true,
          payload: {
            v: addHexPrefix(v.toString(16)),
            r,
            s
          }
        };
      }
    ),

  ethereumSignMessage: jest
    .fn()
    .mockImplementation(async ({ path, message }: { path: string; message: string }) => {
      const childNode = hdNode.derivePath(path);
      const wallet = new Wallet(childNode.privateKey);

      const address = await wallet.getAddress();
      const signature = await wallet.signMessage(message);

      return {
        success: true,
        payload: {
          signature,
          address
        }
      };
    })
};
