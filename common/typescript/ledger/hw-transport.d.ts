declare module '@ledgerhq/hw-transport' {
  /**
   * @description all possible status codes.
   * @see https://github.com/LedgerHQ/blue-app-btc/blob/d8a03d10f77ca5ef8b22a5d062678eef788b824a/include/btchip_apdu_constants.h#L85-L115
   * @example
   * import { StatusCodes } from "@ledgerhq/hw-transport";
   * @export
   * @enum {number}
   */
  export enum StatusCodes {
    PIN_REMAINING_ATTEMPTS = 0x63c0,
    INCORRECT_LENGTH = 0x6700,
    COMMAND_INCOMPATIBLE_FILE_STRUCTURE = 0x6981,
    SECURITY_STATUS_NOT_SATISFIED = 0x6982,
    CONDITIONS_OF_USE_NOT_SATISFIED = 0x6985,
    INCORRECT_DATA = 0x6a80,
    NOT_ENOUGH_MEMORY_SPACE = 0x6a84,
    REFERENCED_DATA_NOT_FOUND = 0x6a88,
    FILE_ALREADY_EXISTS = 0x6a89,
    INCORRECT_P1_P2 = 0x6b00,
    INS_NOT_SUPPORTED = 0x6d00,
    CLA_NOT_SUPPORTED = 0x6e00,
    TECHNICAL_PROBLEM = 0x6f00,
    OK = 0x9000,
    MEMORY_PROBLEM = 0x9240,
    NO_EF_SELECTED = 0x9400,
    INVALID_OFFSET = 0x9402,
    FILE_NOT_FOUND = 0x9404,
    INCONSISTENT_FILE = 0x9408,
    ALGORITHM_NOT_SUPPORTED = 0x9484,
    INVALID_KCV = 0x9485,
    CODE_NOT_INITIALIZED = 0x9802,
    ACCESS_CONDITION_NOT_FULFILLED = 0x9804,
    CONTRADICTION_SECRET_CODE_STATUS = 0x9808,
    CONTRADICTION_INVALIDATION = 0x9810,
    CODE_BLOCKED = 0x9840,
    MAX_VALUE_REACHED = 0x9850,
    GP_AUTH_FAILED = 0x6300,
    LICENSING = 0x6f42,
    HALTED = 0x6faa
  }

  export enum AltStatusCodes {
    'Incorrect length' = 0x6700,
    'Security not satisfied (dongle locked or have invalid access rights)' = 0x6982,
    'Condition of use not satisfied (denied by the user?)' = 0x6985,
    'Invalid data received' = 0x6a80,
    'Invalid parameter received' = 0x6b00,
    INTERNAL_ERROR = 'Internal error, please report'
  }

  export interface Subscription {
    unsubscribe: () => void;
  }

  export interface ITransportError extends Error {
    name: 'TransportError';
    message: string;
    stack?: string;
    id: string;
  }

  /**
   * TransportError is used for any generic transport errors.
   * e.g. Error thrown when data received by exchanges are incorrect or if exchanged failed to communicate with the device for various reason.
   */
  export class TransportError extends Error {
    new(message: string, id: string): ITransportError;
  }

  export interface ITransportStatusError extends Error {
    name: 'TransportStatusError';
    message: string;
    stack?: string;
    statusCode: number;
    statusText: keyof typeof StatusCodes | 'UNKNOWN_ERROR';
  }

  /**
   * Error thrown when a device returned a non success status.
   * the error.statusCode is one of the `StatusCodes` exported by this library.
   */
  export class TransportStatusError extends Error {
    new(statusCode: number): ITransportStatusError;
  }

  export interface Observer<Ev, Err> {
    next: (event: Ev) => void;
    error: (e: Err) => void;
    complete: () => void;
  }

  export interface DescriptorEvent<Descriptor, Device> {
    type: 'add' | 'remove';
    descriptor: Descriptor;
    device?: Device;
  }

  export type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never
  }[keyof T];

  export type ExtractPromise<T> = T extends Promise<infer U> ? U : T;

  export default abstract class LedgerTransport<Descriptor> {
    /**
     *
     * @description Check if a transport is supported on the user's platform/browser.
     * @static
     * @returns {Promise<boolean>}
     * @memberof LedgerTransport
     */
    public static isSupported(): Promise<boolean>;

    /**
     *
     * @description List once all available descriptors. For a better granularity, checkout listen().
     * @static
     * @template Descriptor
     * @returns {Promise<Descriptor[]>}
     * @memberof LedgerTransport
     */
    public static list<Descriptor>(): Promise<Descriptor[]>;

    /**
     *
     * @description Listen all device events for a given Transport.
     * The method takes an Observer of DescriptorEvent and returns a Subscription
     * according to Observable paradigm https://github.com/tc39/proposal-observable
     * a DescriptorEvent is a { descriptor, type } object.
     * Type can be "add" or "remove" and descriptor is a value you can pass to open(descriptor).
     * Each listen() call will first emit all potential device already connected and then will emit events can come over times,
     * for instance if you plug a USB device after listen() or a bluetooth device become discoverable.
     * @static
     * @template Descriptor
     * @template Device
     * @template Err
     * @param {Observer<DescriptorEvent<Descriptor, Device>, Err>} observer
     * @returns {Subscription}
     * @memberof LedgerTransport
     */
    public static listen<Descriptor, Device = any, Err = any>(
      observer: Observer<DescriptorEvent<Descriptor, Device>, Err>
    ): Subscription;

    /**
     *
     * @description Attempt to create a Transport instance with potentially a descriptor.
     * @static
     * @template Descriptor
     * @param {Descriptor} descriptor
     * @param {number} [timeout]
     * @returns {Promise<LedgerTransport<Descriptor>>}
     * @memberof LedgerTransport
     */
    public static open<Descriptor>(
      descriptor: Descriptor,
      timeout?: number
    ): Promise<LedgerTransport<Descriptor>>;

    /**
     *
     * @description create() attempts open the first descriptor available or throw if:
     * - there is no descriptor
     * - if either timeout is reached
     *
     * This is a light alternative to using listen() and open() that you may need for any advanced usecases
     * @static
     * @template Descriptor
     * @param {number} [openTimeout]
     * @param {number} [listenTimeout]
     * @returns {Promise<LedgerTransport<Descriptor>>}
     * @memberof LedgerTransport
     */
    public static create<Descriptor>(
      openTimeout?: number,
      listenTimeout?: number
    ): Promise<LedgerTransport<Descriptor>>;

    /**
     *
     * @description Low level api to communicate with the device.
     *  This method is for implementations to implement but should not be directly called.
     *  Instead, the recommended way is to use send() method
     * @param {Buffer} apdu
     * @returns {Promise<Buffer>}
     * @memberof LedgerTransport
     */
    public abstract exchange(apdu: Buffer): Promise<Buffer>;

    /**
     *
     * @description Set the "scramble key" for the next exchange with the device.
     * Each App can have a different scramble key and they internally will set it at instantiation.
     * @param {string} scrambleKey
     * @memberof LedgerTransport
     */
    public setScrambleKey(scrambleKey: string): void;

    /**
     *
     * @description Close the exchange with the device.
     * @returns {Promise<void>}
     * @memberof LedgerTransport
     */
    public close(): Promise<void>;

    /**
     *
     * @description Listen to an event on an instance of transport.
     * Transport implementation can have specific events. Here are the common events:
     * - "disconnect" : triggered if Transport is disconnected
     * @param {string} eventName
     * @param {Listener} cb
     * @memberof LedgerTransport
     */
    public on(eventName: string | 'listen', cb: (...args: any[]) => any): void;

    /**
     *
     * @description  Stop listening to an event on an instance of transport.
     * @param {string} eventName
     * @param {Listener} cb
     * @memberof LedgerTransport
     */
    public off(eventName: string, cb: (...args: any[]) => any): void;

    /**
     *
     * @description Toggle logs of binary exchange
     * @param {boolean} debug
     * @memberof LedgerTransport
     */
    public setDebugMode(debug: boolean): void;

    /**
     * @description Set a timeout (in milliseconds) for the exchange call.
     * Only some transport might implement it. (e.g. U2F)
     * @param {number} exchangeTimeout
     * @memberof LedgerTransport
     */
    public setExchangeTimeout?(exchangeTimeout: number): void;

    /**
     * @description Used to decorate all callable public methods of an app so that they
     * are mutually exclusive. Scramble key is application specific, e.g hw-app-eth will set
     * its own scramblekey
     * @param self
     * @param methods
     * @param scrambleKey
     */
    public decorateAppAPIMethods<T>(
      self: T,
      methods: FunctionPropertyNames<T>[],
      scrambleKey: string
    ): void;

    /**
     * @description Decorates a function so that it uses a global mutex, if an
     * exchange is already in process, then calling the function will throw an
     * error about being locked
     * @param methodName
     * @param functionToDecorate
     * @param thisContext
     * @param scrambleKey
     */
    public decorateAppAPIMethod<T, FArgs = any, FRet = any>(
      methodName: FunctionPropertyNames<T>,
      functionToDecorate: (...args: FArgs[]) => FRet,
      thisContext: T,
      scrambleKey: string
    ): (...args: FArgs[]) => Promise<ExtractPromise<FRet>>; // make sure we dont wrap promises twice
  }
}
