interface ScryptKDFParamsOut {
  dklen: number;
  n: number;
  p: number;
  r: number;
  salt: string;
}

interface PBKDFParamsOut {
  c: number;
  dklen: number;
  prf: string;
  salt: string;
}

type KDFParamsOut = ScryptKDFParamsOut | PBKDFParamsOut;

export interface V3Keystore {
  crypto: {
    cipher: string;
    cipherparams: {
      iv: string;
    };
    ciphertext: string;
    kdf: string;
    kdfparams: KDFParamsOut;
    mac: string;
  };
  id: string;
  version: number;
  address: string;
}
