import { arrayify, splitSignature } from '@ethersproject/bytes';
import { HDNode } from '@ethersproject/hdnode';
import type { Transaction } from '@ethersproject/transactions';
import { parse } from '@ethersproject/transactions';
import { Wallet } from '@ethersproject/wallet';
import { getPathPrefix, toChecksumAddress } from '@mycrypto/wallets';
import type {
  AddressesOpts,
  SignMessageOpts,
  SignOpts,
  SignResult,
  SignTxOpts
} from 'gridplus-sdk';

import { stripHexPrefix } from '@utils';

const hdNode = HDNode.fromMnemonic('test test test test test test test test test test test ball');

const convertPathToString = (path: number[]): string =>
  path
    .map((p) => {
      const withoutHardening = p - 0x80000000;
      const index = withoutHardening >= 0 ? Math.min(p, withoutHardening) : p;
      const isHardened = index === withoutHardening;
      return `${index}${isHardened ? "'" : ''}`;
    })
    .join('/');

export class Client {
  isPaired = false;
  hasActiveWallet = jest.fn().mockReturnValue(true);
  connect = jest
    .fn()
    .mockImplementation(
      (_deviceID: string, callback: (err: Error | null, isPaired: boolean) => void) => {
        this.isPaired = true;
        callback(null, true);
      }
    );
  sign = jest
    .fn()
    .mockImplementation(
      async (opts: SignOpts, callback: (err: Error | null, data: SignResult) => void) => {
        const path = convertPathToString(opts.data.signerPath);
        const childNode = hdNode.derivePath(path);
        const wallet = new Wallet(childNode.privateKey);
        if (opts.currency === 'ETH') {
          const { signerPath, chainId, ...transaction } = opts.data as SignTxOpts;

          const isEIP1559 =
            transaction.maxFeePerGas !== undefined &&
            transaction.maxPriorityFeePerGas !== undefined;

          const signedTransaction = await wallet.signTransaction({
            ...transaction,
            chainId: parseInt((chainId as unknown) as string, 16),
            type: isEIP1559 ? 2 : 0
          });
          const { v, r, s } = parse(signedTransaction) as Required<Transaction>;
          callback(null, {
            sig: {
              // eslint-disable-next-line no-restricted-globals
              v: v === 0 ? Buffer.from([]) : Buffer.from([v]),
              r: stripHexPrefix(r),
              s: stripHexPrefix(s)
            }
          });
        } else if (opts.currency === 'ETH_MSG') {
          const signMessageOpts = opts.data as SignMessageOpts;
          const signature = await wallet.signMessage(arrayify(signMessageOpts.payload));
          const { v, r, s } = splitSignature(signature);

          callback(null, {
            sig: {
              // eslint-disable-next-line no-restricted-globals
              v: v === 0 ? Buffer.from([]) : Buffer.from([v]),
              r: stripHexPrefix(r),
              s: stripHexPrefix(s)
            }
          });
        }
      }
    );
  getAddresses = jest
    .fn()
    .mockImplementation(
      (opts: AddressesOpts, callback: (err: Error | null, data: string[]) => void) => {
        const path = convertPathToString(opts.startPath);
        const indices = path.split('/');
        const offset = parseInt(indices[indices.length - 1]);

        const masterNode = hdNode.derivePath(getPathPrefix(path));
        const result = new Array(opts.n).fill(undefined).map((_, i) => {
          const index = offset + i;
          const node = masterNode.derivePath(index.toString(10));
          return toChecksumAddress(node.address);
        });
        callback(null, result);
      }
    );
}
