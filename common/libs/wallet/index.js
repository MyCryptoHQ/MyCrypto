import { privateToAddress, publicToAddress, sha3 } from 'ethereumjs-util';
import crypto from 'crypto';
import scrypt from 'scryptsy';
import uuid from 'uuid';
import { makeBlob, kdf, scryptSettings } from 'libs/globalFuncs';
import BaseWallet from './base';

export default class Wallet extends BaseWallet {
  constructor(priv, pub, path, hwType, hwTransport) {
    super();
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

  getV3Filename(timestamp) {
    const ts = timestamp ? new Date(timestamp) : new Date();
    return [
      'UTC--',
      ts.toJSON().replace(/:/g, '-'),
      '--',
      this.getAddress().toString('hex')
    ].join('');
  }

  getAddress() {
    if (typeof this.pubKey === 'undefined') {
      return privateToAddress(this.privKey);
    } else {
      return publicToAddress(this.pubKey, true);
    }
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
}
