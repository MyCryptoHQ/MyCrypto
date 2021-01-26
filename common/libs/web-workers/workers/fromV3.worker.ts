import Wallet from 'ethereumjs-wallet';
import 'regenerator-runtime/runtime.js';

const worker: Worker = self as any;
interface DecryptionParameters {
  keystore: string;
  password: string;
  nonStrict: boolean;
}

worker.onmessage = async (event: MessageEvent) => {
  const info: DecryptionParameters = event.data;
  try {
    const rawKeystore: Wallet = await Wallet.fromV3(info.keystore, info.password, info.nonStrict);
    worker.postMessage(rawKeystore.getPrivateKeyString());
  } catch (e) {
    worker.postMessage(e.message);
  }
};
