import { IV3Wallet } from 'ethereumjs-wallet';
import Worker from 'worker-loader!./workers/generateKeystore.worker.ts';

interface KeystorePayload {
  filename: string;
  keystore: IV3Wallet;
  privateKey: string;
}

export default function generateKeystore(
  password: string,
  n_factor: number,
  chainId: number
): Promise<KeystorePayload> {
  return new Promise(resolve => {
    const worker = new Worker();
    worker.postMessage({ password, n_factor, chainId });
    worker.onmessage = (ev: MessageEvent) => {
      const filename: string = ev.data.filename;
      const privateKey: string = ev.data.privateKey;
      const keystore: IV3Wallet = ev.data.keystore;
      resolve({ keystore, filename, privateKey });
    };
  });
}
