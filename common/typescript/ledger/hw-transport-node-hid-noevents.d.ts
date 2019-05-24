declare module '@ledgerhq/hw-transport-node-hid-noevents' {
  import LedgerTransport, { Observer, DescriptorEvent, Subscription } from '@ledgerhq/hw-transport';
  import { HID, Device } from 'node-hid';

  export default class TransportNodeHidNoEvents extends LedgerTransport<string> {
    /**
     *
     * @description Check if an HID instance is active
     * @static
     * @returns {Promise<boolean>}
     * @memberof TransportNodeHidNoEvents
     */
    public static isSupported(): Promise<boolean>;

    /**
     *
     * @description Lists all available HID device's paths
     * @static
     * @returns {Promise<string[]>}
     * @memberof TransportNodeHidNoEvents
     */
    public static list<Descriptor = string>(): Promise<Descriptor[]>;

    /**
     *
     * @description Listen all device events for a given Transport.
     * The method takes an Observer of DescriptorEvent and returns a Subscription
     * according to Observable paradigm https://github.com/tc39/proposal-observable
     * a DescriptorEvent is a { descriptor, type } object.
     * Type can be "add" or "remove" and descriptor is a value you can pass to open(descriptor).
     * Each listen() call will first emit all potential device already connected and then will emit events can come over times,
     * for instance if you plug a USB device after listen().
     * @static
     * @template Descriptor
     * @template Device
     * @template Err
     * @param {Observer<DescriptorEvent<Descriptor, Device>, Err>} observer
     * @returns {Subscription}
     * @memberof TransportNodeHidNoEvents
     */
    public static listen<Descriptor = string, Device = HID, Err = void>(
      observer: Observer<DescriptorEvent<Descriptor, Device>, Err>
    ): Subscription;

    /**
     *
     * @description Attempt to create a Transport instance with a descriptor.
     * @static
     * @template Descriptor
     * @param {Descriptor} devicePath
     * @returns {Promise<TransportNodeHidNoEvents>}
     * @memberof TransportNodeHidNoEvents
     */
    public static open<Descriptor = string>(
      devicePath: Descriptor
    ): Promise<TransportNodeHidNoEvents>;

    /**
     * @description Creates an instance of TransportNodeHidNoEvents.
     * @example
     *
     * ```ts
     * import TransportNodeHidNoEvents from "@ledgerhq/hw-transport-node-u2f";
     * TransportNodeHidNoEvents.create().then(transport => ...);
     * ```
     *
     * @param {HID} device
     * @param {boolean} [ledgerTransport]
     * @param {number} [timeout]
     * @param {boolean} [debug]
     * @memberof TransportNodeHidNoEvents
     */
    constructor(device: HID, ledgerTransport?: boolean, timeout?: number, debug?: boolean);

    /**
     *
     * @description Low level api to communicate with the device.
     * @param {Buffer} apdu
     * @returns {Promise<Buffer>}
     * @memberof TransportNodeHidNoEvents
     */
    public exchange(apdu: Buffer): Promise<Buffer>;

    /**
     *
     * @description Does nothing
     * @memberof TransportNodeHidNoEvents
     */
    public setScrambleKey(): void;

    /**
     *
     * @description Close the exchange with the device.
     * @returns {Promise<void>}
     * @memberof TransportNodeHidNoEvents
     */
    public close(): Promise<void>;
  }
}
