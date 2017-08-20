//@flow

import { createHash, createDecipheriv } from 'crypto';

//adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L230
export function decryptPrivKey(encprivkey: string, password: string): Buffer {
  let cipher = encprivkey.slice(0, 128);
  cipher = decodeCryptojsSalt(cipher);
  let evp = evp_kdf(new Buffer(password), cipher.salt, {
    keysize: 32,
    ivsize: 16
  });
  let decipher = createDecipheriv('aes-256-cbc', evp.key, evp.iv);
  let privKey = decipherBuffer(decipher, new Buffer(cipher.ciphertext));

  return new Buffer(privKey.toString(), 'hex');
}

//adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L284
export function decodeCryptojsSalt(input: string): Object {
  let ciphertext = new Buffer(input, 'base64');
  if (ciphertext.slice(0, 8).toString() === 'Salted__') {
    return {
      salt: ciphertext.slice(8, 16),
      ciphertext: ciphertext.slice(16)
    };
  } else {
    return {
      ciphertext: ciphertext
    };
  }
}

//adapted from https://github.com/kvhnuke/etherwallet/blob/de536ffebb4f2d1af892a32697e89d1a0d906b01/app/scripts/myetherwallet.js#L297
export function evp_kdf(data: Buffer, salt: Buffer, opts: Object) {
  // A single EVP iteration, returns `D_i`, where block equlas to `D_(i-1)`

  function iter(block) {
    let hash = createHash(opts.digest || 'md5');
    hash.update(block);
    hash.update(data);
    hash.update(salt);
    block = hash.digest();
    for (let i = 1; i < (opts.count || 1); i++) {
      hash = createHash(opts.digest || 'md5');
      hash.update(block);
      block = hash.digest();
    }
    return block;
  }
  let keysize = opts.keysize || 16;
  let ivsize = opts.ivsize || 16;
  let ret = [];
  let i = 0;
  while (Buffer.concat(ret).length < keysize + ivsize) {
    ret[i] = iter(i === 0 ? new Buffer(0) : ret[i - 1]);
    i++;
  }
  let tmp = Buffer.concat(ret);
  return {
    key: tmp.slice(0, keysize),
    iv: tmp.slice(keysize, keysize + ivsize)
  };
}

export function decipherBuffer(decipher: Object, data: Buffer): Buffer {
  return Buffer.concat([decipher.update(data), decipher.final()]);
}
