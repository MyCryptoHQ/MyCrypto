import { mnemonicToSeed, validateMnemonic } from 'bip39';
import { createDecipheriv, createHash } from 'crypto';
import { privateToAddress } from 'ethereumjs-util';
import { fromMasterSeed } from 'hdkey';
import { stripHexPrefixAndLower } from 'libs/values';

// adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L230
export function decryptPrivKey(encprivkey: string, password: string): Buffer {
  const cipher = encprivkey.slice(0, 128);
  const decryptedCipher = decodeCryptojsSalt(cipher);
  const evp = evp_kdf(new Buffer(password), decryptedCipher.salt, {
    keysize: 32,
    ivsize: 16
  });
  const decipher = createDecipheriv('aes-256-cbc', evp.key, evp.iv);
  const privKey = decipherBuffer(decipher, new Buffer(decryptedCipher.ciphertext));

  return new Buffer(privKey.toString(), 'hex');
}

// adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L284
export function decodeCryptojsSalt(input: string): any {
  const ciphertext = new Buffer(input, 'base64');
  if (ciphertext.slice(0, 8).toString() === 'Salted__') {
    return {
      salt: ciphertext.slice(8, 16),
      ciphertext: ciphertext.slice(16)
    };
  } else {
    return {
      ciphertext
    };
  }
}

// adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L297
export function evp_kdf(data: Buffer, salt: Buffer, opts: any) {
  // A single EVP iteration, returns `D_i`, where block equlas to `D_(i-1)`

  function iter(block) {
    let hash = createHash(opts.digest || 'md5');
    hash.update(block);
    hash.update(data);
    hash.update(salt);
    block = hash.digest();
    for (let e = 1; e < (opts.count || 1); e++) {
      hash = createHash(opts.digest || 'md5');
      hash.update(block);
      block = hash.digest();
    }
    return block;
  }
  const keysize = opts.keysize || 16;
  const ivsize = opts.ivsize || 16;
  const ret: any[] = [];
  let i = 0;
  while (Buffer.concat(ret).length < keysize + ivsize) {
    ret[i] = iter(i === 0 ? new Buffer(0) : ret[i - 1]);
    i++;
  }
  const tmp = Buffer.concat(ret);
  return {
    key: tmp.slice(0, keysize),
    iv: tmp.slice(keysize, keysize + ivsize)
  };
}

export function decipherBuffer(decipher: any, data: Buffer): Buffer {
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

export function decryptMnemonicToPrivKey(
  phrase: string,
  pass: string,
  path: string,
  address: string
): Buffer {
  phrase = phrase.trim();
  address = stripHexPrefixAndLower(address);

  if (!validateMnemonic(phrase)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = mnemonicToSeed(phrase, pass);
  const derived = fromMasterSeed(seed).derive(path);
  const dPrivKey = derived.privateKey;
  const dAddress = privateToAddress(dPrivKey).toString('hex');

  if (dAddress !== address) {
    throw new Error(`Derived ${dAddress}, expected ${address}`);
  }

  return dPrivKey;
}
