import { IFullWallet, fromPrivateKey } from 'ethereumjs-wallet';
import { toBuffer } from 'ethereumjs-util';
import Worker from 'worker-loader!./workers/scrypt-worker.worker.ts';

export const fromV3 = (
  keystore: string,
  password: string,
  nonStrict: boolean
): Promise<IFullWallet> => {
  return new Promise((resolve, reject) => {
    const scryptWorker = new Worker();
    scryptWorker.postMessage({ keystore, password, nonStrict });
    scryptWorker.onmessage = event => {
      const data: string = event.data;
      try {
        const wallet = fromPrivateKey(toBuffer(data));
        resolve(wallet);
      } catch (e) {
        reject(e);
      }
    };
  });
};
