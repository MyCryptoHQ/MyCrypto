declare module 'hdkey' {
  export default class HDKey {
    privateKey: Buffer;
    publicKey: Buffer;
    chainCode: Buffer | string;
    static fromMasterSeed(seedBuffer: Buffer, versions?: any[]): HDKey;
    static fromExtendedKey(base58key: any, versions?: any[]): HDKey;
    static fromJSON(obj: any): HDKey;
    derive(path: string): HDKey;
  }
}
