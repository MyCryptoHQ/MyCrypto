import { default as Wallet } from 'ethereumjs-wallet';

const worker: Worker = self as any;

interface GenerateParameters {
  password: string;
  N_FACTOR: number;
}

worker.onmessage = (event: MessageEvent) => {
  const info: GenerateParameters = event.data;
  const wallet = Wallet.generate();
  const filename = wallet.getV3Filename();
  const privateKey = wallet.getPrivateKeyString();
  const keystore = wallet.toV3(info.password, { n: info.N_FACTOR });

  worker.postMessage({ keystore, filename, privateKey });
};
