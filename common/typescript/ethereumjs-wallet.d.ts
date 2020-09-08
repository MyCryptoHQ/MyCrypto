import 'ethereumjs-wallet';

declare module 'ethereumjs-wallet' {
  /**
   * ethereumjs-wallet doesn't export the `V3Keystore` type so it's declared here and merged with the actual
   * declarations.
   */
  export interface IV3Wallet {
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
}
