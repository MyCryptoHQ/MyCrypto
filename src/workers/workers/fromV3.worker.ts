import { default as Wallet } from 'ethereumjs-wallet';

const worker: Worker = self as any;
interface DecryptionParameters {
  keystore: string;
  password: string;
  nonStrict: boolean;
}

worker.onmessage = (event: MessageEvent) => {
  const info: DecryptionParameters = event.data;
  try {
    const rawKeystore: Wallet = Wallet.fromV3(info.keystore, info.password, info.nonStrict);
    worker.postMessage(rawKeystore.getPrivateKeyString());
  } catch (e) {
    worker.postMessage(e.message);
  }
};
