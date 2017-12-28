import { fromV3, IFullWallet } from 'ethereumjs-wallet';

declare var postMessage: any;
interface DecryptionParameters {
  keystore: string;
  password: string;
  nonStrict: boolean;
}

onmessage = event => {
  const info: DecryptionParameters = event.data;
  try {
    const rawKeystore: IFullWallet = fromV3(info.keystore, info.password, info.nonStrict);
    postMessage(rawKeystore.getPrivateKeyString());
  } catch (e) {
    postMessage(e.message);
  }
};
