declare module '@ledgerhq/hw-transport' {
  /**
   * An object that listens to a Transport.
   */
  export interface Observer<Event> {
    next(event: Event): void;
    error(error: any): void;
    complete(): void;
  }

  /**
   * An event that is triggered when a Descriptor is added or removed.
   */
  export interface DescriptorEvent<Descriptor> {
    type: 'add' | 'remove';
    descriptor: Descriptor;
  }

  /**
   * A subscription to a Descriptor.
   */
  export interface Subscription {
    unsubscribe(): void;
  }

  export default class Transport<Descriptor> {
    /**
     * Whether or not this transport method is supported by the browser or platform.
     *
     * @return {boolean} True if the method is supported, false otherwise.
     */
    public static isSupported(): Promise<boolean>;

    /**
     * List all available descriptors. For a better granularity, use `listen()`.
     *
     * @return {Promise<any[]>} All available descriptors.
     */
    public static list(): Promise<any[]>;

    /**
     * Listen to all device events for a given Transport. The method takes an Observer of
     * DescriptorEvent and returns a Subscription (according to Observable paradigm
     * https://github.com/tc39/proposal-observable). Each `listen()` call will first emit all
     * potential devices already connected and then will emit events that can come over time, for
     * instance if you plug a USB device after `listen()` or a Bluetooth device becomes
     * discoverable.
     *
     * @param {Observer} observer The observer object.
     * @return A Subcription object on which you can `.unsubscribe()`, to stop listening to
     *   descriptors.
     */
    public static listen(observer: Observer<DescriptorEvent<any>>): Subscription;

    /**
     * Attempt to create an instance of the Transport with the descriptor.
     *
     * @param {any} descriptor The descriptor to open the Transport with.
     * @param {number} timeout An optional timeout.
     * @return {Promise<Transport<any>>} A Promise with the Transport instance.
     */
    public static open(descriptor: any, timeout?: number): Promise<Transport<any>>;

    /**
     * Open the first descriptor available or throw if there is none, or if the timeout is reached.
     *
     * @param {number} openTimeout The optional open timeout.
     * @param {number} listenTimeout The optional listen timeout.
     */
    public static create(openTimeout?: number, listenTimeout?: number): Promise<Transport<any>>;

    /**
     * Low level API to communicate with the device. This method should not be directly called, the
     * recommended way is to use the `send()` method.
     *
     * @param {Buffer} apdu The data to send.
     * @return {Promise<Buffer>} A Promise with the return data.
     */
    public exchange(apdu: Buffer): Promise<Buffer>;

    /**
     * Set the scramble key for next exchanges with the device.
     *
     * @param {string} key The scramble key to use.
     */
    public setScrambleKey(key: string): void;

    /**
     * Close the exchange with the device.
     *
     * @return {Promise<void>} A Promise that ends when the transport is closed.
     */
    public close(): Promise<void>;

    /**
     * Listen to an event on the Transport. Each Transport can have it's own specific events.
     *
     * @param {string} eventName The event to listen to.
     * @param {() => void} callback A callback that is called when the event is triggered.
     */
    public on(eventName: string | 'disconnect', callback: () => void): void;

    /**
     * Stop listening to a specific event.
     *
     * @param {string} eventName The event to stop listening to.
     * @param {() => void} callback The callback to stop listening to.
     */
    public off(eventName: string | 'disconnect', callback: () => void): void;

    /**
     * Trigger a specific event with optional arguments.
     *
     * @param {string} eventName The event to trigger.
     * @param {any[]} args The optional arguments.
     */
    public emit(eventName: string, ...args: any[]): void;
    public emit(eventName: 'disconnect'): void;

    /**
     * Enable or disable debug mode. If enabled, logs of the binary exchange will be logged to the
     * console, or a function will be called if specified.
     *
     * @param {boolean|((string) => void)} debug Whether to enable debug mode or not, with an
     *   optional function.
     */
    public setDebugMode(debug: boolean | ((log: string) => void)): void;

    /**
     * Set a timeout in milliseconds for the exchange call. Some transports may not implement this
     * timeout.
     *
     * @param {number} exchangeTimeout The timeout in milliseconds to use.
     */
    public setExchangeTimeout(exchangeTimeout: number): void;

    /**
     * A wrapper on top of `exchange()` to simplify the implementation.
     *
     * @param cla
     * @param ins
     * @param p1
     * @param p2
     * @param data
     * @param statusList A list of accepted status codes (shorts). If not specified, [0x9000] is
     *   used.
     * @return {Promise<Buffer>} A Promise with the response data.
     */
    public send(
      cla: number,
      ins: number,
      p1: number,
      p2: number,
      data?: Buffer,
      statusList?: number[]
    ): Promise<Buffer>;
  }
}
