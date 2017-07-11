// @flow
import { makeBlob } from 'libs/globalFuncs';
import { randomBytes } from 'crypto';
import { pkeyToKeystore, getV3Filename } from 'libs/keystore';

export type WalletFile = {
  fileName: string,
  blobURI: string
};

export function genNewWalletFile(password: string): WalletFile {
  let pkey = randomBytes(32);
  let blobEnc = makeBlob('text/json;charset=UTF-8', pkeyToKeystore(pkey, password));
  const encFileName = getV3Filename(pkey);
  return {
    fileName: encFileName,
    blobURI: blobEnc
  };
}
