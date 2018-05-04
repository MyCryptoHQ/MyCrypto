declare module '@ledgerhq/hw-transport-u2f' {
  import LedgerTransport, {
    Observer,
    DescriptorEvent,
    Subscription,
    TransportError
  } from '@ledgerhq/hw-transport';
  import { isSupported, sign } from 'u2f-api';

  export default class TransportU2F extends LedgerTransport<null> {
    public static isSupported: typeof isSupported;

    /**
     * @description this transport is not discoverable but we are going to guess if it is here with isSupported()
     * @static
     * @template Descriptor An array with [null] if supported device
     * @returns {Descriptor}
     * @memberof TransportU2F
     */
    public static list<Descriptor = [null] | never[]>(): Descriptor;

    /**
     *
     * @description Listen all device events for a given Transport.
     * The method takes an Observer of DescriptorEvent and returns a Subscription
     * according to Observable paradigm https://github.com/tc39/proposal-observable
     * a DescriptorEvent is a { descriptor, type } object.
     * Type can be "add" or "remove" and descriptor is a value you can pass to open(descriptor).
     * Each listen() call will first emit all potential device already connected and then will emit events can come over times,
     * @static
     * @template Descriptor
     * @template Device
     * @template Err
     * @param {Observer<
     *         DescriptorEvent<Device, Descriptor>,
     *         ErrParam
     *       >} observer
     * @returns {Subscription}
     * @memberof TransportU2F
     */
    public static listen<Descriptor = undefined, Device = null, Err = TransportError>(
      observer: Observer<DescriptorEvent<Device, Descriptor>, Err>
    ): Subscription;

    /**
     *
     * @description static function to create a new Transport from a connected
     * Ledger device discoverable via U2F (browser support)
     *
     * @static
     * @param {*} _
     * @param {number} [_openTimeout]
     * @returns {Promise<TransportU2F>}
     * @memberof TransportU2F
     */
    public static open(_?: any, __?: number): Promise<TransportU2F>;

    /**
     *
     * @description Low level api to communicate with the device.
     * @param {Buffer} adpu
     * @returns {Promise<Buffer>}
     * @memberof TransportU2F
     */
    public exchange(adpu: Buffer): Promise<Buffer>;

    /**
     *
     * @description Set the "scramble key" for the next exchange with the device.
     * Each App can have a different scramble key and they internally will set it at instantiation.
     * @param {string} scrambleKey
     * @memberof TransportU2F
     */
    public setScrambleKey(scrambleKey: string): void;

    /**
     *
     * @description Close the exchange with the device.
     * @returns {Promise<void>}
     * @memberof TransportU2F
     */
    public close(): Promise<void>;
  }
}
