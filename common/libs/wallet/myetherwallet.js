import {
  privateToAddress,
  privateToPublic,
  publicToAddress,
  toChecksumAddress,
  sha3
} from 'ethereumjs-util';
import crypto from 'crypto';
import { errorMsgs } from 'config/data';
import scrypt from 'scryptsy';
import uuid from 'uuid';
import { makeBlob, kdf, scryptSettings } from 'libs/globalFuncs';

class Wallet {
  constructor(priv, pub, path, hwType, hwTransport) {
    if (typeof priv !== 'undefined') {
      this.privKey = priv.length === 32 ? priv : Buffer(priv, 'hex');
    }
    this.pubKey = pub;
    this.path = path;
    this.hwType = hwType;
    this.hwTransport = hwTransport;
    this.type = 'default';
  }

  static generate(icapDirect) {
    if (icapDirect) {
      while (true) {
        const privKey = crypto.randomBytes(32);
        if (privateToAddress(privKey)[0] === 0) {
          return new Wallet(privKey);
        }
      }
    } else {
      return new Wallet(crypto.randomBytes(32));
    }
  }

  static fromV3(input, password, nonStrict) {
    const json = typeof input === 'object'
      ? input
      : JSON.parse(nonStrict ? input.toLowerCase() : input);
    if (json.version !== 3) {
      throw new Error('Not a V3 wallet');
    }
    let derivedKey;
    let kdfparams;
    if (json.crypto.kdf === 'scrypt') {
      kdfparams = json.crypto.kdfparams;
      derivedKey = scrypt(
        new Buffer(password),
        new Buffer(kdfparams.salt, 'hex'),
        kdfparams.n,
        kdfparams.r,
        kdfparams.p,
        kdfparams.dklen
      );
    } else if (json.crypto.kdf === 'pbkdf2') {
      kdfparams = json.crypto.kdfparams;
      if (kdfparams.prf !== 'hmac-sha256') {
        throw new Error('Unsupported parameters to PBKDF2');
      }
      derivedKey = crypto.pbkdf2Sync(
        new Buffer(password),
        new Buffer(kdfparams.salt, 'hex'),
        kdfparams.c,
        kdfparams.dklen,
        'sha256'
      );
    } else {
      throw new Error('Unsupported key derivation scheme');
    }
    const ciphertext = new Buffer(json.crypto.ciphertext, 'hex');
    const mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
    if (mac.toString('hex') !== json.crypto.mac) {
      throw new Error('Key derivation failed - possibly wrong passphrase');
    }
    const decipher = crypto.createDecipheriv(
      json.crypto.cipher,
      derivedKey.slice(0, 16),
      new Buffer(json.crypto.cipherparams.iv, 'hex')
    );
    let seed = Wallet.decipherBuffer(decipher, ciphertext, 'hex');
    while (seed.length < 32) {
      const nullBuff = new Buffer([0x00]);
      seed = Buffer.concat([nullBuff, seed]);
    }
    return new Wallet(seed);
  }

  static fromEthSale(input, password) {
    const json = typeof input === 'object' ? input : JSON.parse(input);
    const encseed = new Buffer(json.encseed, 'hex');
    const derivedKey = crypto
      .pbkdf2Sync(Buffer(password), Buffer(password), 2000, 32, 'sha256')
      .slice(0, 16);
    const decipher = crypto.createDecipheriv(
      'aes-128-cbc',
      derivedKey,
      encseed.slice(0, 16)
    );
    const seed = Wallet.decipherBuffer(decipher, encseed.slice(16));
    const wallet = new Wallet(sha3(seed));
    if (wallet.getAddress().toString('hex') !== json.ethaddr) {
      throw new Error('Decoded key mismatch - possibly wrong passphrase');
    }
    return wallet;
  }

  static decodeCryptojsSalt(input) {
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

  static decipherBuffer(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }

  static evp_kdf(data, salt, opts) {
    // A single EVP iteration, returns `D_i`, where block equals to `D_(i-1)`

    function iter(block) {
      let hash = crypto.createHash(opts.digest || 'md5');
      hash.update(block);
      hash.update(data);
      hash.update(salt);
      block = hash.digest();
      for (let i = 1; i < (opts.count || 1); i++) {
        hash = crypto.createHash(opts.digest || 'md5');
        hash.update(block);
        block = hash.digest();
      }
      return block;
    }
    const keysize = opts.keysize || 16;
    const ivsize = opts.ivsize || 16;
    const ret = [];
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

  static fromMyEtherWallet(input, password) {
    const json = typeof input === 'object' ? input : JSON.parse(input);
    let privKey;
    if (!json.locked) {
      if (json.private.length !== 64) {
        throw new Error('Invalid private key length');
      }
      privKey = new Buffer(json.private, 'hex');
    } else {
      if (typeof password !== 'string') {
        throw new Error('Password required');
      }
      if (password.length < 7) {
        throw new Error('Password must be at least 7 characters');
      }
      let cipher = json.encrypted ? json.private.slice(0, 128) : json.private;
      cipher = Wallet.decodeCryptojsSalt(cipher);
      const evp = Wallet.evp_kdf(new Buffer(password), cipher.salt, {
        keysize: 32,
        ivsize: 16
      });
      const decipher = crypto.createDecipheriv('aes-256-cbc', evp.key, evp.iv);
      privKey = Wallet.decipherBuffer(decipher, new Buffer(cipher.ciphertext));
      privKey = new Buffer(privKey.toString(), 'hex');
    }
    const wallet = new Wallet(privKey);
    if (wallet.getAddressString() !== json.address) {
      throw new Error('Invalid private key or address');
    }
    return wallet;
  }

  toV3(password, opts = {}) {
    const salt = opts.salt || crypto.randomBytes(32);
    const iv = opts.iv || crypto.randomBytes(16);
    let derivedKey;
    const kdf = opts.kdf || 'scrypt';
    const kdfparams = {
      dklen: opts.dklen || 32,
      salt: salt.toString('hex')
    };
    if (kdf === 'pbkdf2') {
      kdfparams.c = opts.c || 262144;
      kdfparams.prf = 'hmac-sha256';
      derivedKey = crypto.pbkdf2Sync(
        new Buffer(password),
        salt,
        kdfparams.c,
        kdfparams.dklen,
        'sha256'
      );
    } else if (kdf === 'scrypt') {
      // FIXME: support progress reporting callback
      kdfparams.n = opts.n || 262144;
      kdfparams.r = opts.r || 8;
      kdfparams.p = opts.p || 1;
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
    const cipher = crypto.createCipheriv(
      opts.cipher || 'aes-128-ctr',
      derivedKey.slice(0, 16),
      iv
    );
    if (!cipher) {
      throw new Error('Unsupported cipher');
    }
    const ciphertext = Buffer.concat([
      cipher.update(this.privKey),
      cipher.final()
    ]);
    const mac = sha3(
      Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex')])
    );
    return {
      version: 3,
      id: uuid.v4({
        random: opts.uuid || crypto.randomBytes(16)
      }),
      address: this.getAddress().toString('hex'),
      Crypto: {
        ciphertext: ciphertext.toString('hex'),
        cipherparams: {
          iv: iv.toString('hex')
        },
        cipher: opts.cipher || 'aes-128-ctr',
        kdf,
        kdfparams,
        mac: mac.toString('hex')
      }
    };
  }

  getBalance() {
    return this.balance;
  }

  getPath() {
    return this.path;
  }

  getHWType() {
    return this.hwType;
  }

  getHWTransport() {
    return this.hwTransport;
  }

  getPrivateKey() {
    return this.privKey;
  }

  getPrivateKeyString() {
    if (typeof this.privKey !== 'undefined') {
      return this.getPrivateKey().toString('hex');
    } else {
      return '';
    }
  }

  getPublicKey() {
    if (typeof this.pubKey === 'undefined') {
      return privateToPublic(this.privKey);
    } else {
      return this.pubKey;
    }
  }

  getPublicKeyString() {
    if (typeof this.pubKey === 'undefined') {
      return `0x${this.getPublicKey().toString('hex')}`;
    } else {
      return `0x${this.pubKey.toString('hex')}`;
    }
  }

  getAddress() {
    if (typeof this.pubKey === 'undefined') {
      return privateToAddress(this.privKey);
    } else {
      return publicToAddress(this.pubKey, true);
    }
  }

  getAddressString() {
    return `0x${this.getAddress().toString('hex')}`;
  }

  getChecksumAddressString() {
    return toChecksumAddress(this.getAddressString());
  }

  getBlob(password) {
    return makeBlob(
      'text/json;charset=UTF-8',
      this.toV3(password, {
        kdf: kdf,
        n: scrypt.n
      })
    );
  }

  getV3Filename(timestamp) {
    const ts = timestamp ? new Date(timestamp) : new Date();
    return [
      'UTC--',
      ts.toJSON().replace(/:/g, '-'),
      '--',
      this.getAddress().toString('hex')
    ].join('');
  }

  toJSON() {
    return {
      address: this.getAddressString(),
      checksumAddress: this.getChecksumAddressString(),
      privKey: this.getPrivateKeyString(),
      pubKey: this.getPublicKeyString(),
      publisher: 'MyEtherWallet',
      encrypted: false,
      version: 2
    };
  }
}

export default Wallet;
