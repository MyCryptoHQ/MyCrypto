/**
 * Incomplete -- Provider-engine needs its own typings
 */
declare module 'ethereumjs-wallet/provider-engine' {
  import { PublicKeyOnlyWallet, FullWallet } from 'ethereumjs-wallet';
  class WalletSubprovider {
    constructor(wallet: PublicKeyOnlyWallet | FullWallet, opts: object);
  }
}

declare module 'ethereumjs-wallet/hdkey' {
  import { Buffer } from 'buffer';
  import { PublicKeyOnlyWallet, FullWallet } from 'ethereumjs-wallet';

  interface IHDNodePublic {
    /**
     * @description return a BIP32 extended public key (xpub)
     */
    publicExtendedKey(): string;

    /**
     * @description derive a node based on a path (e.g. m/44'/0'/0/1)
     */
    derivePath(path: string): IHDNodePublic;

    /**
     * @description derive a node based on a child index
     */
    deriveChild(index): IHDNodePublic;

    /**
     * @description return a Wallet instance 
     */
    getWallet(): PublicKeyOnlyWallet;
  }

  /**
   * 
   * 
   * @interface IHDNodePrivate
   */
  interface IHDNodePrivate {
    /**
     * @description return a BIP32 extended private key (xprv)
     */
    privateExtendedKey(): string;

    /**
     * @description return a BIP32 extended public key (xpub)
     */
    publicExtendedKey(): string;

    /**
     * @description derive a node based on a path (e.g. m/44'/0'/0/1)
     */
    derivePath(path: string): IHDNodePrivate | IHDNodePublic;

    /**
     * @description derive a node based on a child index
     */
    deriveChild(index): IHDNodePrivate | IHDNodePublic;

    /**
     * @description return a Wallet instance 
     */
    getWallet(): FullWallet;
  }

  /**
     * @description create an instance based on a seed
     */
  function fromMasterSeed(seed: Buffer): IHDNodePrivate;

  /**
     * @description create an instance based on a BIP32 extended private or public key
     */
  function fromExtendedKey(key: string): IHDNodePrivate | IHDNodePublic;
}

declare module 'ethereumjs-wallet' {
  import { Buffer } from 'buffer';

  interface IPresaleWallet {
    encseed: string;
    ethaddr: string;
    btcaddr: string;
    email: string;
  }

  interface IKdfParams {
    dklen: number;
    salt: string; // Random salt for the kdf. Size must match the requirements of the KDF (key derivation function). Random number generated via crypto.getRandomBytes if nothing is supplied.
  }

  interface IScryptKdfParams extends IKdfParams {
    n: number; // Iteration count. Defaults to 262144.
    r: number; // Block size for the underlying hash. Defaults to 8.
    p: number; // Parallelization factor. Defaults to 1.
  }

  interface IPbkdf2KdfParams extends IKdfParams {
    prf: 'hmac-sha256';
    c: number;
  }

  interface IV1Wallet {
    Version: 1;
    Crypto: {
      KeyHeader: {
        Kdf: 'scrypt';
        KdfParams: {
          N: number;
          R: number;
          P: number;
          DkLen: number;
        };
      };
      MAC: string;
      CipherText: string;
      Salt: string;
      IV: string;
    };
  }

  interface IV3Wallet {
    version: 3;
    crypto: {
      kdf: 'scrypt' | 'pbkdf2';
      kfdparams: IScryptKdfParams | IPbkdf2KdfParams;
      ciphertext: string;
      mac: string;
      cipher: string;
      cipherParams: {
        iv: string;
      };
    };
  }

  interface IEtherWalletLocked {
    private: string;
    encrypted: true;
    address: string;
    locked: true;
  }

  interface IEtherWalletUnlocked {
    private: string;
    locked: false;
    encrypted: false;
    address: string;
  }

  interface IV3Options {
    salt?: Buffer; // Random salt for the kdf. Size must match the requirements of the KDF (key derivation function). Random number generated via crypto.getRandomBytes if nothing is supplied.
    iv?: Buffer; // Initialization vector for the cipher. Size must match the requirements of the cipher. Random number generated via crypto.getRandomBytes if nothing is supplied.
    kdf?: string; // The key derivation function, see below.
    dklen?: number; // Derived key length. For certain cipher settings, this must match the block sizes of those.
    uuid?: Buffer; // UUID. One is randomly generated.
    cipher?: string | 'aes-128-ctr' | 'aes-128-cbc'; // The cipher to use. Names must match those of supported by OpenSSL, e.g. aes-128-ctr or aes-128-cbc.

    /* pbkdf2 */
    c?: number; //  Number of iterations. Defaults to 262144.

    /* scrypt */
    n?: number; // Iteration count. Defaults to 262144.
    r?: number; // Block size for the underlying hash. Defaults to 8.
    p?: number; // Parallelization factor. Defaults to 1.
  }

  class PublicKeyOnlyWallet {
    /**
     * @description return the public key
     */
    getPublicKey(): Buffer; //only returns uncompressed Ethereum-style public keys.

    /**
     * @description return the public key
     */
    getPublicKeyString(): string;

    /**
     * @description  return the address
     */
    getAddress(): Buffer;

    /**
     * 
     * @description return the address
     */
    getAddressString(): string;

    /**
     * @description  return the address with checksum
     */
    getChecksumAddressString(): string;

    /**
     * @description return the suggested filename for V3 keystores
     */
    getV3Filename(timestamp?: number);
  }
  class FullWallet extends PublicKeyOnlyWallet {
    /**
     * @description return the private key
     */
    getPrivateKey(): Buffer;

    /**
     * @description return the private key
     */
    getPrivateKeyString(): string;

    /**
     * @description return the wallet as a JSON string (Version 3 of the Ethereum wallet format)
     */
    toV3(password: string, options?: IV3Options);
  }

  /**
     * 
     * @param icap
     * @description create an instance based on a new random key (setting icap to true will generate an address suitable for the ICAP Direct mode
     */
  function generate(icap?: boolean): FullWallet;

  /**
     * 
     * @param pattern
     * @description create an instance where the address is valid against the supplied pattern (this will be very slow)
     */
  function generateVanityAddress(pattern: string | RegExp): FullWallet;

  /**
     * @description create an instance based on a raw private key
     * @param input
     *
     */
  function fromPrivateKey(input: Buffer): FullWallet;

  /**
     * @description create an instance based on a BIP32 extended private key (xprv)
     * @param input 
     */
  function fromExtendedPrivateKey(input: Buffer): FullWallet;

  /**
     * @description create an instance based on a public key (certain methods will not be available)
     * @param input 
     * @param nonStrict 
     */
  function fromPublicKey(
    input: Buffer,
    nonStrict?: boolean
  ): PublicKeyOnlyWallet;

  /**
     * @description  create an instance based on a BIP32 extended public key (xpub)
     * @param input 
     */
  function fromExtendedPublicKey(input: string): PublicKeyOnlyWallet;

  /**
     * @description import a wallet (Version 1 of the Ethereum wallet format)
     * @param input 
     * @param password 
     */
  function fromV1(input: IV1Wallet | string, password: string): FullWallet;

  /**
     * @description import a wallet (Version 3 of the Ethereum wallet format). Set nonStrict true to accept files with mixed-caps.
     * @param input 
     * @param password
     * @param nonStrict
     */
  function fromV3(
    input: IV3Wallet | string,
    password: string,
    nonStrict: boolean
  ): FullWallet;

  /**
     * @description import an Ethereum Pre Sale wallet
     * @param input 
     * @param password 
     */
  function fromEthSale(
    input: IPresaleWallet | string,
    password: string
  ): FullWallet;

  /**
     * @description import a brain wallet used by Ether.Camp
     * @param input 
     * @param password 
     */
  function fromEtherCamp(passphrase: string): FullWallet;

  /**
     * @description import a wallet generated by EtherWallet
     * @param input 
     * @param password 
     */
  function fromEtherWallet(
    input: IEtherWalletLocked | IEtherWalletUnlocked | string,
    password: string
  ): FullWallet;

  /**
     * @description  import a wallet from a KryptoKit seed 
     * @param entropy 
     * @param seed 
     */
  function fromKryptoKit(entropy: string, seed: string): FullWallet;

  /**
     * @description import a brain wallet used by Quorum Wallet
     * @param passphrase 
     * @param userid 
     */
  function fromQuorumWallet(passphrase: string, userid: string): FullWallet;
}
