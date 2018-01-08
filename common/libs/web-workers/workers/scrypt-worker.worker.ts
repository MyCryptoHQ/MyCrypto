import { fromV3, IFullWallet } from 'ethereumjs-wallet';

const scryptWorker: Worker = self as any;
interface DecryptionParameters {
  keystore: string;
  password: string;
  nonStrict: boolean;
}

scryptWorker.onmessage = (event: MessageEvent) => {
  const info: DecryptionParameters = event.data;
  try {
    const rawKeystore: IFullWallet = fromV3(info.keystore, info.password, info.nonStrict);
    scryptWorker.postMessage(rawKeystore.getPrivateKeyString());
  } catch (e) {
    scryptWorker.postMessage(e.message);
  }
};
