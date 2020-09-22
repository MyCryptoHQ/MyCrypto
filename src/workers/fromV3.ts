import { toBuffer } from 'ethereumjs-util';
import { default as Wallet } from 'ethereumjs-wallet';
import Worker from 'worker-loader!./workers/fromV3.worker.ts';

export default function fromV3(
  keystore: string,
  password: string,
  nonStrict: boolean
): Promise<Wallet> {
  return new Promise((resolve, reject) => {
    const worker = new Worker();
    worker.postMessage({ keystore, password, nonStrict });
    worker.onmessage = (ev: MessageEvent) => {
      const data = ev.data;
      try {
        const wallet = Wallet.fromPrivateKey(toBuffer(data));
        resolve(wallet);
      } catch (e) {
        reject(e);
      }
    };
  });
}
