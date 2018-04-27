import { generate } from 'ethereumjs-wallet';
import { toChecksumAddressByChainId } from 'libs/checksum';

const worker: Worker = self as any;

interface GenerateParameters {
  password: string;
  N_FACTOR: number;
  chainId: number;
}

worker.onmessage = (event: MessageEvent) => {
  const info: GenerateParameters = event.data;
  const wallet = generate();
  const filename = wallet.getV3Filename();
  const privateKey = wallet.getPrivateKeyString();
  const keystore = wallet.toV3(info.password, { n: info.N_FACTOR });
  keystore.address = toChecksumAddressByChainId(keystore.address, info.chainId);
  worker.postMessage({ keystore, filename, privateKey });
};
