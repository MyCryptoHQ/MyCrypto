declare module '@ledgerhq/hw-transport-webusb' {
  import { DeviceModel } from '@ledgerhq/devices';
  import Transport, { DescriptorEvent, Observer, Subscription } from '@ledgerhq/hw-transport';

  export default class TransportWebUSB extends Transport<USBDevice> {
    /**
     * List all available descriptors. For a better granularity, use `listen()`.
     *
     * @return {Promise<USBDevice[]>} All available descriptors.
     */
    public static list(): Promise<USBDevice[]>;

    /**
     * Listen to all device events for a given Transport. The method takes an Observer of
     * DescriptorEvent and returns a Subscription (according to Observable paradigm
     * https://github.com/tc39/proposal-observable). Each `listen()` call will first emit all
     * potential devices already connected and then will emit events that can come over time, for
     * instance if you plug a USB device after `listen()` or a Bluetooth device becomes
     * discoverable.
     *
     * Must be called in the context of a UI click.
     *
     * @param {Observer} observer The observer object.
     * @return A Subcription object on which you can `.unsubscribe()`, to stop listening to
     *   descriptors.
     */
    public static listen(observer: Observer<DescriptorEvent<USBDevice>>): Subscription;

    /**
     * Attempt to create an instance of the Transport with the descriptor.
     *
     * @param {USBDevice} descriptor The descriptor to open the Transport with.
     * @return {Promise<Transport<TransportWebUSB>} A Promise with the Transport instance.
     */
    public static open(descriptor: USBDevice): Promise<TransportWebUSB>;

    /**
     * Open the first descriptor available or throw if there is none, or if the timeout is reached.
     *
     * Must be called in the context of a UI click.
     *
     * @param {number} openTimeout The optional open timeout.
     * @param {number} listenTimeout The optional listen timeout.
     */
    public static create(openTimeout?: number, listenTimeout?: number): Promise<TransportWebUSB>;

    /**
     * Similar to `open()`, but will always ask for device permissions, even if the device is already accepted.
     *
     * @return {Promise<TransportWebUSB>} A Promise with the Transport instance.
     */
    public static request(): Promise<TransportWebUSB>;

    /**
     * Similar to `open()`, but will never ask for device permissions.
     *
     * @return {Promise<TransportWebUSB | null>} A Promise with the Transport instance or null if no device was found.
     */
    public static openConnected(): Promise<TransportWebUSB | null>;

    public readonly device: USBDevice;
    public readonly deviceModel?: DeviceModel;
    public readonly channel: number;
    public readonly packetSize: number;

    public constructor(device: USBDevice);

    /**
     * Not used by this specific Transport.
     */
    public setScramblekey(): void;
  }
}
