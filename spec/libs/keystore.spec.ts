import {
  decryptMewV1ToPrivKey,
  decryptUtcKeystoreToPkey
} from '../../common/libs/keystore';

const mewV1Keystore = {
  address: '0x15bd5b09f42ddd49a266570f165d2732f3372e7d',
  encrypted: true,
  locked: true,
  hash: '5927d16b10d5d1df8a678a6f7d4770f2ac4eafe71387126fff6c1b1e93876d7a',
  private:
    'U2FsdGVkX19us8qXfYyeQhxyzV7aFlXckG/KrRLajoCGBKO4/saefxGs/3PrCLWxZEbx2vn6V0VDWrkDUkL+8S4MK7FL9LCiIKxeCq/ciwX9YQepsRRetG2MExuUWkQ6365d',
  public:
    'U2FsdGVkX1/egEFLhHiGKzn08x+MovElanAzvwcvMEf7FUSAjDEKKt0Jc+Cnz3fsVlO0nNXDG7i4sP7gEyqdEj+vlwyMXv7ir9mwCwQ1+XWz7k5BFUg0Bw9xh2ygtnGDOBjF3TDm0YL+Gdtf9WS7rcOBD0tQWHJ7N5DIBUM5WKOa0bwdCqJgrTKX73XI5mjX/kR9VFnvv+nezVkSvb66nQ=='
};
const mewV1PrivKey =
  'a56d4f23449a10ddcdd94bad56f895640097800406840aa8fe545d324d422c02';
const utcKeystore = {
  version: 3,
  id: 'cb788af4-993d-43ad-851b-0d2031e52c61',
  address: '25a24679f35e447f778cf54a3823facf39904a63',
  Crypto: {
    ciphertext:
      '4193915c560835d00b2b9ff5dd20f3e13793b2a3ca8a97df649286063f27f707',
    cipherparams: {
      iv: 'dccb8c009b11d1c6226ba19b557dce4c'
    },
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      salt: '037a53e520f2d00fb70f02f39b31b77374de9e0e1d35fd7cbe9c8a8b21d6b0ab',
      n: 1024,
      r: 8,
      p: 1
    },
    mac: '774fbe4bf35e7e28df15cd6c3546e74ce6608e9ab68a88d50227858a3b05769a'
  }
};
const utcPrivKey =
  '8bcb4456ef0356ce062c857cefdd3ed1bab45432cf76d6d5340899cfd0f702e8';
const password = 'testtesttest';

describe('decryptMewV1ToPrivKey', () => {
  it('should derive the correct private key', () => {
    const result = decryptMewV1ToPrivKey(
      JSON.stringify(mewV1Keystore),
      password
    );

    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString('hex')).toEqual(mewV1PrivKey);
  });
});

describe('decryptUtcKeystoreToPkey', () => {
  it('should derive the correct private key', () => {
    const result = decryptUtcKeystoreToPkey(
      JSON.stringify(utcKeystore),
      password
    );

    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString('hex')).toEqual(utcPrivKey);
  });
});
