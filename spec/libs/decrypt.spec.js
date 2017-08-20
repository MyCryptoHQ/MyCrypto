import {
  decryptPrivKey,
  decodeCryptojsSalt,
  evp_kdf,
  decipherBuffer
} from '../../common/libs/decrypt';

//deconstructed elements of a V1 encrypted priv key
const encpkey =
  'U2FsdGVkX19us8qXfYyeQhxyzV7aFlXckG/KrRLajoCGBKO4/saefxGs/3PrCLWxZEbx2vn6V0VDWrkDUkL+8S4MK7FL9LCiIKxeCq/ciwX9YQepsRRetG2MExuUWkQ6365d';
const pass = 'testtesttest';
const salt = 'brPKl32MnkI=';
const ciphertext =
  'HHLNXtoWVdyQb8qtEtqOgIYEo7j+xp5/Eaz/c+sItbFkRvHa+fpXRUNauQNSQv7xLgwrsUv0sKIgrF4Kr9yLBf1hB6mxFF60bYwTG5RaRDrfrl0=';
const iv = 'k9YWF8ZBCoyuFS6CfGS+7w==';
const key = 'u9uhwRmBQDJ12MUBkIrO5EzMQZTYEf6hTBDzSJBKJ2k=';
const pkey = 'a56d4f23449a10ddcdd94bad56f895640097800406840aa8fe545d324d422c02';

describe('decryptPrivKey', () => {
  it('should decrypt encrypted pkey string to pkey buffer', () => {
    const decrypt = decryptPrivKey(encpkey, pass);

    expect(decrypt).toBeInstanceOf(Buffer);
    expect(decrypt.toString('hex')).toEqual(pkey);
    expect(decrypt.length).toEqual(32);
  });
});

describe('decodeCryptojsSalt', () => {
  it('should derive correct salt and ciphertext from pkey string', () => {
    const decode = decodeCryptojsSalt(encpkey);

    expect(decode.salt).toBeInstanceOf(Buffer);
    expect(decode.ciphertext).toBeInstanceOf(Buffer);
    expect(decode.salt.toString('base64')).toEqual(salt);
    expect(decode.ciphertext.toString('base64')).toEqual(ciphertext);
  });
});

describe('evp_kdf', () => {
  it('should derive correct key and iv', () => {
    const result = evp_kdf(
      new Buffer(pass, 'utf8'),
      new Buffer(salt, 'base64'),
      { keysize: 32, ivsize: 16 }
    );

    expect(result.key).toBeInstanceOf(Buffer);
    expect(result.iv).toBeInstanceOf(Buffer);
    expect(result.key.toString('base64')).toEqual(key);
    expect(result.iv.toString('base64')).toEqual(iv);
  });
});

describe('decipherBuffer', () => {
  const str = 'test string';
  const data = new Buffer(str, 'utf8');
  const decipher = {
    update: jest.fn(d => d),
    final: jest.fn(() => new Buffer('!', 'utf8'))
  };
  const result = decipherBuffer(decipher, data);

  it('should call update and final on decipher', () => {
    expect(decipher.update).toHaveBeenCalledWith(data);
    expect(decipher.final).toHaveBeenCalled();
  });

  it('should return concat of update and final buffers', () => {
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toEqual(str + '!');
  });
});
