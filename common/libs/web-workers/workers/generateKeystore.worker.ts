import { generate } from 'ethereumjs-wallet';
import { toChecksumAddress } from 'ethereumjs-util';

const worker: Worker = self as any;

interface GenerateParameters {
  password: string;
  N_FACTOR: number;
}

worker.onmessage = (event: MessageEvent) => {
  const info: GenerateParameters = event.data;
  const wallet = generate();
  const filename = wallet.getV3Filename();
  const privateKey = wallet.getPrivateKeyString();
  const keystore = wallet.toV3(info.password, { n: info.N_FACTOR });
  keystore.address = toChecksumAddress(keystore.address);
  worker.postMessage({ keystore, filename, privateKey });
};
