declare module 'ledgerhq__hw-transport' {
  export interface Subscription {
    unsubscribe: () => void;
  }

  export interface Observer<Ev, NextRet, ErrParam, ErrRet, CompleteRet> {
    next: (event: Ev) => NextRet;
    error: (e: ErrParam) => ErrRet;
    complete: () => CompleteRet;
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
     * @template Ev
     * @template NextRet
     * @template ErrParam
     * @template ErrRet
     * @template CompleteRet
     * @param {Observer<Ev, NextRet, ErrParam, ErrRet, CompleteRet>} observer
     * @returns {Subscription}
     * @memberof LedgerTransport
     */
    public static listen<
      Descriptor,
      Device = any,
      NextRet = any,
      ErrParam = any,
      ErrRet = any,
      CompleteRet = any
    >(
      observer: Observer<
        DescriptorEvent<Descriptor, Device>,
        NextRet,
        ErrParam,
        ErrRet,
        CompleteRet
      >
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
