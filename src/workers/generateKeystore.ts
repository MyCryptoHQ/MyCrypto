import { IV3Wallet } from 'ethereumjs-wallet';
import Worker from 'worker-loader!./workers/generateKeystore.worker.ts';

interface KeystorePayload {
  filename: string;
  keystore: IV3Wallet;
  privateKey: string;
}

export default function generateKeystore(
  password: string,
  N_FACTOR: number
): Promise<KeystorePayload> {
  return new Promise((resolve) => {
    const worker = new Worker();
    worker.postMessage({ password, N_FACTOR });
    worker.onmessage = (ev: MessageEvent) => {
      const filename: string = ev.data.filename;
      const privateKey: string = ev.data.privateKey;
      const keystore = ev.data.keystore;
      resolve({ keystore, filename, privateKey });
    };
  });
}
