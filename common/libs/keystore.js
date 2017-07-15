// @flow
import { randomBytes, createCipheriv } from 'crypto';
import { privateToPublic, publicToAddress, sha3 } from 'ethereumjs-util';
import scrypt from 'scryptsy';
import uuid from 'uuid';
import { makeBlob } from 'libs/globalFuncs';

export const scryptSettings = {
  n: 1024
};

export const kdf = 'scrypt';

export function genNewPkey(): Buffer {
  return randomBytes(32);
}

export function pkeyToAddress(pkey: Buffer): string {
  return publicToAddress(privateToPublic(pkey)).toString('hex');
}

export function pkeyToKeystore(pkey: Buffer, password: string) {
  const salt = randomBytes(32);
  const iv = randomBytes(16);
  let derivedKey;
  const kdfparams: Object = {
    dklen: 32,
    salt: salt.toString('hex')
  };
  if (kdf === 'scrypt') {
    // FIXME: support progress reporting callback
    kdfparams.n = 1024;
    kdfparams.r = 8;
    kdfparams.p = 1;
    derivedKey = scrypt(
      new Buffer(password),
      salt,
      kdfparams.n,
      kdfparams.r,
      kdfparams.p,
      kdfparams.dklen
    );
  } else {
    throw new Error('Unsupported kdf');
  }
  const cipher = createCipheriv('aes-128-ctr', derivedKey.slice(0, 16), iv);
  if (!cipher) {
    throw new Error('Unsupported cipher');
  }
  const ciphertext = Buffer.concat([cipher.update(pkey), cipher.final()]);
  const mac = sha3(
    Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex')])
  );
  return {
    version: 3,
    id: uuid.v4({
      random: randomBytes(16)
    }),
    address: pkeyToAddress(pkey),
    Crypto: {
      ciphertext: ciphertext.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      cipher: 'aes-128-ctr',
      kdf,
      kdfparams,
      mac: mac.toString('hex')
    }
  };
}

export function getV3Filename(pkey: Buffer) {
  const ts = new Date();
  return [
    'UTC--',
    ts.toJSON().replace(/:/g, '-'),
    '--',
    pkeyToAddress(pkey)
  ].join('');
}

export type WalletFile = {
  fileName: string,
  blobURI: string
};

export function genNewKeystore(pkey: Buffer, password: string): WalletFile {
  let blobEnc = makeBlob(
    'text/json;charset=UTF-8',
    pkeyToKeystore(pkey, password)
  );
  const encFileName = getV3Filename(pkey);
  return {
    fileName: encFileName,
    blobURI: blobEnc
  };
}
