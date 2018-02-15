declare module 'hdkey' {
  export default class HDKey {
    privateKey: Buffer;
    publicKey: Buffer;
    chainCode: Buffer | string;
    fromMasterSeed(seedBuffer: Buffer, versions?: any[]): HDKey;
    fromExtendedKey(base58key: any, versions?: any[]): HDKey;
    fromJSON(obj: any): HDKey;
    derive(path: string): HDKey;
  }
}
