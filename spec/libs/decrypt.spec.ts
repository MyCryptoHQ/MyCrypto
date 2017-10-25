import {
  decryptPrivKey,
  decodeCryptojsSalt,
  evp_kdf,
  decipherBuffer,
  decryptMnemonicToPrivKey
} from '../../common/libs/decrypt';

// Elements of a V1 encrypted priv key
const v1 = {
  encpkey:
    'U2FsdGVkX19us8qXfYyeQhxyzV7aFlXckG/KrRLajoCGBKO4/saefxGs/3PrCLWxZEbx2vn6V0VDWrkDUkL+8S4MK7FL9LCiIKxeCq/ciwX9YQepsRRetG2MExuUWkQ6365d',
  pass: 'testtesttest',
  salt: 'brPKl32MnkI=',
  ciphertext:
    'HHLNXtoWVdyQb8qtEtqOgIYEo7j+xp5/Eaz/c+sItbFkRvHa+fpXRUNauQNSQv7xLgwrsUv0sKIgrF4Kr9yLBf1hB6mxFF60bYwTG5RaRDrfrl0=',
  iv: 'k9YWF8ZBCoyuFS6CfGS+7w==',
  key: 'u9uhwRmBQDJ12MUBkIrO5EzMQZTYEf6hTBDzSJBKJ2k=',
  pkey: 'a56d4f23449a10ddcdd94bad56f895640097800406840aa8fe545d324d422c02'
};

describe('decryptPrivKey', () => {
  it('should decrypt encrypted pkey string to pkey buffer', () => {
    const decrypt = decryptPrivKey(v1.encpkey, v1.pass);

    expect(decrypt).toBeInstanceOf(Buffer);
    expect(decrypt.toString('hex')).toEqual(v1.pkey);
    expect(decrypt.length).toEqual(32);
  });
});

describe('decodeCryptojsSalt', () => {
  it('should derive correct salt and ciphertext from pkey string', () => {
    const decode = decodeCryptojsSalt(v1.encpkey);

    expect(decode.salt).toBeInstanceOf(Buffer);
    expect(decode.ciphertext).toBeInstanceOf(Buffer);
    expect(decode.salt.toString('base64')).toEqual(v1.salt);
    expect(decode.ciphertext.toString('base64')).toEqual(v1.ciphertext);
  });
});

describe('evp_kdf', () => {
  it('should derive correct key and iv', () => {
    const result = evp_kdf(
      new Buffer(v1.pass, 'utf8'),
      new Buffer(v1.salt, 'base64'),
      { keysize: 32, ivsize: 16 }
    );

    expect(result.key).toBeInstanceOf(Buffer);
    expect(result.iv).toBeInstanceOf(Buffer);
    expect(result.key.toString('base64')).toEqual(v1.key);
    expect(result.iv.toString('base64')).toEqual(v1.iv);
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

describe('decryptMnemonicToPrivKey', () => {
  const mocks = [
    {
      phrase:
        'first catalog away faculty jelly now life kingdom pigeon raise gain accident',
      pass: '',
      path: "m/44'/60'/0'/0/8",
      address: '0xe2EdC95134bbD88443bc6D55b809F7d0C2f0C854',
      privKey:
        '31e97f395cabc6faa37d8a9d6bb185187c35704e7b976c7a110e2f0eab37c344'
    },
    {
      phrase:
        'grace near jewel celery divorce unlock thumb segment since photo cushion meat sketch tooth edit',
      pass: '',
      path: "m/44'/60'/0'/0/18",
      address: '0xB20f8aCA62e18f4586aAEf4720daCac23cC29954',
      privKey:
        '594ee624ebad54b9469915c3f5eb22127727a5e380a17d24780dbe272996b401'
    },
    {
      phrase:
        'airport bid shop easy tiger rule under afraid lobster adapt ranch story elbow album rifle turtle earn witness',
      pass: '',
      path: "m/44'/60'/0'/0/24",
      address: '0xE6D0932fFDDcB45bf0e18dE4716137dEdD2E4c2c',
      privKey:
        '6aba8bb6018a85af7cb552325b52e397f83cfb56f68cf8937aa14c3875bbb0aa'
    },
    {
      phrase:
        'plug strong practice prize crater private together anchor horror nasty option exhibit position engage pledge giggle soda lecture syrup ocean barrel',
      pass: '',
      path: "m/44'/60'/0'/0/0",
      address: '0xd163f4d95782608b251c4d985846A1754c53D32C',
      privKey:
        '88046b4bdbb1c88945662cb0984258ca1b09df0bb0b38fdc55bcb8998f28aad4'
    },
    {
      phrase:
        'laptop pool call below prepare car alley wheel bunker valve soul misery buffalo home hobby timber enlist country mind guilt drastic castle cable federal',
      pass: '',
      path: "m/44'/60'/0'/0/4",
      address: '0x04E2df6Fe2a28dd24dbCC49485ff30Fc3ea04822',
      privKey:
        'fc9ad0931a3aee167179c1fd31825b7a7b558b4bb2eb3fb0c04028c98d495907'
    },
    {
      phrase:
        'stadium river pigeon midnight grit truck fiscal eight hello rescue destroy eyebrow',
      pass: 'password',
      path: "m/44'/60'/0'/0/5",
      address: '0xe74908668F594f327fd2215A2564Cf79298a136e',
      privKey:
        'b65abfb2660f71b4b46aed98975f0cc1ebe1fcb3835a7a10b236e4012c93f306'
    },
    {
      phrase:
        'oval save glimpse regret decline pottery wealth canal post sing congress bounce run unable stove',
      pass: 'password',
      path: "m/44'/60'/0'/0/10",
      address: '0x0d20865AfAE9B8a1F867eCd60684FBCDA3Bd1FA5',
      privKey:
        '29eb9ec0f5586d1935bc4c6bd89e6fb3de76b4fad345fa844efc5432885cfe73'
    },
    {
      phrase:
        'lecture defy often frog young blush exact tomato culture north urge rescue resemble require bring dismiss actress fog',
      pass: 'password',
      path: "m/44'/60'/0'/0/7",
      address: '0xdd5d6e5dEfD09c3F2BD6d994EE43B59df88c7187',
      privKey:
        'd13404b9b05f6b5bf8e5cf810aa903e4b60ac654b0acf09a8ea0efe174746ae5'
    },
    {
      phrase:
        'supreme famous violin such option marriage arctic genius member rare siege circle round field weather humble fame buffalo one control marble',
      pass: 'password',
      path: "m/44'/60'/0'/0/11",
      address: '0x6d95e7cC28113F9491b2Ec6b621575a5565Fd208',
      privKey:
        'a52329aa3d6f2426f8783a1e5f419997e2628ec9a89cc2b7b182d2eaf7f95a24'
    },
    {
      phrase:
        'next random ready come great start beyond learn supply chimney include grocery fee phrase margin adult ocean craft topple subject satoshi angry mystery liar',
      pass: 'password',
      path: "m/44'/60'/0'/0/4",
      address: '0x3e583eF3d3cE5Dd483c86A1E00A479cE11Ca21Cf',
      privKey:
        '450538d4181c4d8ce076ecb34785198316adebe959d6f9462cfb68a58b1819bc'
    },
    {
      phrase:
        'champion pitch profit beyond know imitate weasel gift escape bullet price barely crime renew hurry',
      pass: 'password123',
      path: "m/44'/60'/0'/1",
      address: '0x7545D615643F933c34C3E083E68CC831167F31af',
      privKey:
        '0a43098da5ae737843e385b76b44266a9f8f856cb1b943055b5a96188d306d97'
    }
  ];

  it('should derive correct private key from variable phrase lengths/passwords/paths', () => {
    mocks.forEach(mock => {
      const { phrase, pass, path, privKey, address } = mock;
      const derivedPrivKey = decryptMnemonicToPrivKey(
        phrase,
        pass,
        path,
        address
      );
      expect(derivedPrivKey.toString('hex')).toEqual(privKey);
    });
  });
});
