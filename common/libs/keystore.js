// @flow
import {
  randomBytes,
  createCipheriv,
  pbkdf2Sync,
  createDecipheriv
} from 'crypto';
import { decipherBuffer, decodeCryptojsSalt, evp_kdf } from './decrypt';
import { sha3, privateToAddress } from 'ethereumjs-util';
import scrypt from 'scryptsy';
import uuid from 'uuid';

export type UtcKeystore = {
  version: number,
  id: string,
  address: string,
  Crypto: Object
};

//adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L342
export function determineKeystoreType(file: string): string {
  const parsed = JSON.parse(file);

  if (parsed.encseed) return 'presale';
  else if (parsed.Crypto || parsed.crypto) return 'v2-v3-utc';
  else if (parsed.hash && parsed.locked === true) return 'v1-encrypted';
  else if (parsed.hash && parsed.locked === false) return 'v1-unencrypted';
  else if (parsed.publisher === 'MyEtherWallet') return 'v2-unencrypted';
  else throw new Error('Invalid keystore');
}

export function isKeystorePassRequired(file: string): boolean {
  switch (determineKeystoreType(file)) {
    case 'presale':
      return true;
    case 'v1-unencrypted':
      return false;
    case 'v1-encrypted':
      return true;
    case 'v2-unencrypted':
      return false;
    case 'v2-v3-utc':
      return true;
    default:
      return false;
  }
}

//adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L218
export function decryptPresaleToPrivKey(
  file: string,
  password: string
): Buffer {
  let json = JSON.parse(file);
  let encseed = new Buffer(json.encseed, 'hex');
  let derivedKey = pbkdf2Sync(
    new Buffer(password),
    new Buffer(password),
    2000,
    32,
    'sha256'
  ).slice(0, 16);
  let decipher = createDecipheriv(
    'aes-128-cbc',
    derivedKey,
    encseed.slice(0, 16)
  );
  let seed = decipherBuffer(decipher, encseed.slice(16));
  let privkey = sha3(seed);
  let address = privateToAddress(privkey);

  if (address.toString('hex') !== json.ethaddr) {
    throw new Error('Decoded key mismatch - possibly wrong passphrase');
  }
  return privkey;
}

//adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L179
export function decryptMewV1ToPrivKey(file: string, password: string): Buffer {
  let json = JSON.parse(file);
  let privkey, address;

  if (typeof password !== 'string') {
    throw new Error('Password required');
  }
  if (password.length < 7) {
    throw new Error('Password must be at least 7 characters');
  }
  let cipher = json.encrypted ? json.private.slice(0, 128) : json.private;
  cipher = decodeCryptojsSalt(cipher);
  let evp = evp_kdf(new Buffer(password), cipher.salt, {
    keysize: 32,
    ivsize: 16
  });
  let decipher = createDecipheriv('aes-256-cbc', evp.key, evp.iv);
  privkey = decipherBuffer(decipher, new Buffer(cipher.ciphertext));
  privkey = new Buffer(privkey.toString(), 'hex');
  address = '0x' + privateToAddress(privkey).toString('hex');

  if (address !== json.address) {
    throw new Error('Invalid private key or address');
  }
  return privkey;
}

export const scryptSettings = {
  n: 1024
};

export const kdf = 'scrypt';

export function pkeyToKeystore(
  pkey: Buffer,
  address: string,
  password: string
): UtcKeystore {
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
    address,
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

export function getV3Filename(address: string) {
  const ts = new Date();
  return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', address].join('');
}

export function decryptUtcKeystoreToPkey(
  input: string,
  password: string
): Buffer {
  let kstore = JSON.parse(input.toLowerCase());
  if (kstore.version !== 3) {
    throw new Error('Not a V3 wallet');
  }
  let derivedKey, kdfparams;

  if (kstore.crypto.kdf === 'scrypt') {
    kdfparams = kstore.crypto.kdfparams;
    derivedKey = scrypt(
      new Buffer(password),
      new Buffer(kdfparams.salt, 'hex'),
      kdfparams.n,
      kdfparams.r,
      kdfparams.p,
      kdfparams.dklen
    );
  } else if (kstore.crypto.kdf === 'pbkdf2') {
    kdfparams = kstore.crypto.kdfparams;
    if (kdfparams.prf !== 'hmac-sha256') {
      throw new Error('Unsupported parameters to PBKDF2');
    }
    derivedKey = pbkdf2Sync(
      new Buffer(password),
      new Buffer(kdfparams.salt, 'hex'),
      kdfparams.c,
      kdfparams.dklen,
      'sha256'
    );
  } else {
    throw new Error('Unsupported key derivation scheme');
  }
  let ciphertext = new Buffer(kstore.crypto.ciphertext, 'hex');
  let mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
  if (mac.toString('hex') !== kstore.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong passphrase');
  }
  let decipher = createDecipheriv(
    kstore.crypto.cipher,
    derivedKey.slice(0, 16),
    new Buffer(kstore.crypto.cipherparams.iv, 'hex')
  );
  let seed = decipherBuffer(decipher, ciphertext);
  while (seed.length < 32) {
    let nullBuff = new Buffer([0x00]);
    seed = Buffer.concat([nullBuff, seed]);
  }
  return seed;
}
