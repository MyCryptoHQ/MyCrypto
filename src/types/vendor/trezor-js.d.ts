/* tslint:disable max-classes-per-file */
// Types are only based off of what's mentioned in the API
// https://github.com/trezor/trezor.js/blob/master/API.md

declare module 'trezor.js' {
  import { EventEmitter } from 'events';
  import { TrezorDeviceInfoWithSession as DeviceDescriptor, Transport } from 'trezor-link';

  /***************/
  /* Device List */
  /***************/

  export interface DeviceListOptions {
    debug?: boolean;
    debugInfo?: boolean;
    transport?: Transport;
    nodeTransport?: Transport;
    configUrl?: string;
    config?: string;
    bridgeVersionUrl?: string;
    clearSession?: boolean;
    clearSessionTime?: number;
    rememberDevicePasshprase?: boolean;
    // Unsure of these options or our need for them
    // getPassphraseHash?(device: Device): number[] | undefined;
    // xpubDerive?: (xpub: string, network: bitcoin.Network, index: number) => Promise<string>;
  }

  export class DeviceList extends EventEmitter {
    public transport: Transport | undefined;
    public devices: { [k: string]: Device };
    public unacquiredDevices: { [k: string]: UnacquiredDevice };
    constructor(opts?: DeviceListOptions);
    public acquireFirstDevice(
      rejectOnEmpty?: boolean
    ): Promise<{ device: Device; session: Session }>;
  }

  /**********/
  /* Device */
  /**********/

  export interface CoinType {
    coin_name: string;
    coin_shortcut: string;
    address_type: number;
    maxfee_kb: number;
    address_type_p2sh: number;
  }

  export interface Features {
    vendor: string;
    major_version: number;
    minor_version: number;
    patch_version: number;
    bootloader_mode: boolean;
    device_id: string;
    pin_protection: boolean;
    passphrase_protection: boolean;
    language: string;
    label: string;
    coins: CoinType[];
    initialized: boolean;
    revision: string;
    bootloader_hash: string;
    imported: boolean;
    pin_cached: boolean;
    passphrase_cached: boolean;
    needs_backup?: boolean;
    firmware_present?: boolean;
    flags?: number;
    model?: string;
    unfinished_backup?: boolean;
  }

  export interface RunOptions {
    aggressive?: boolean;
    skipFinalReload?: boolean;
    waiting?: boolean;
    onlyOneActivity?: boolean;
  }

  export class Device extends EventEmitter {
    public path: string;
    public features: Features;

    constructor(
      transport: Transport,
      descriptor: DeviceDescriptor,
      features: Features,
      deviceList: DeviceList
    );

    public isBootloader(): boolean;
    public isInitialized(): boolean;
    public getVersion(): string;
    public atLeast(v: string): boolean;
    public isUsed(): boolean;
    public isUsedHere(): boolean;
    public isUsedElsewhere(): boolean;

    public run<T>(fn: (session: Session) => Promise<T> | T, options?: RunOptions): Promise<T>;
    public waitForSessionAndRun<T>(
      fn: (session: Session) => Promise<T> | T,
      options?: RunOptions
    ): Promise<T>;
    public steal(): Promise<boolean>;
  }

  /*********************/
  /* Unacquired Device */
  /*********************/

  export class UnacquiredDevice extends EventEmitter {
    public path: string;
    constructor(transport: Transport, descriptor: DeviceDescriptor, deviceList: DeviceList);
    public steal(): Promise<boolean>;
  }

  /***********/
  /* Session */
  /***********/

  export interface MessageResponse<T> {
    type: string;
    message: T;
  }

  export interface EthereumSignature {
    v: number;
    r: string;
    s: string;
  }

  export interface HDPubNode {
    depth: number;
    fingerprint: number;
    child_num: number;
    chain_code: string;
    public_key: string;
  }

  export interface PublicKey {
    node: HDPubNode;
    xpub: string;
  }

  export type DefaultMessageResponse = MessageResponse<object>;

  export class Session extends EventEmitter {
    public typedCall<T>(type: string, resType: string, message: T): Promise<T>;
    public getEntropy(size: number): Promise<MessageResponse<{ bytes: string }>>;
    public ethereumGetAddress(
      path: number[],
      display?: boolean
    ): Promise<MessageResponse<{ address: string; path: number[] }>>;
    public clearSession(): Promise<boolean>;
    public signEthMessage(
      path: number[],
      message: string
    ): Promise<MessageResponse<{ address: string; signature: string }>>;
    public verifyEthMessage(address: string, signature: string, message: string): Promise<boolean>;
    public signEthTx(
      path: number[],
      nonce: string,
      gasPrice: string,
      gasLimit: string,
      to: string,
      value: string,
      data?: string,
      chainId?: number
    ): Promise<EthereumSignature>;
    public getPublicKey(
      path: number[],
      coin?: string | CoinType
    ): Promise<MessageResponse<PublicKey>>;

    /* Unused functions, either Bitcoin-centric or just things we wouldn't want to touch */
    // public getAddress(path: number[], coin: string | CoinType, display: boolean): Promise<MessageResponse<{ address: string }>>;
    // public verifyAddress(path: number[], refAddress: string, coin: string | CoinType): Promise<boolean>;
    // public getHDNode(path: number[], coin: string | CoinType): Promise<HDNode>;
    // public wipeDevice(): Promise<boolean>;
    // public resetDevice(...): Promise<boolean>;
    // public loadDevice(...): Promise<boolean>;
    // public recoverDevice(...): Promise<boolean>;
    // public updateFirmware(payload: string): Promise<boolean>;
    // public signMessage(path: number[], message: string, coin: string | CoinType, segwit: boolean): Promise<object>;
    // public verifyMessage(...): Promise<boolean>;
    // public signIdentity(...): any;
  }
}
