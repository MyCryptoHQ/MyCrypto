declare module '@ledgerhq/hw-transport-node-hid-noevents' {
  import Transport, { DescriptorEvent, Observer, Subscription } from '@ledgerhq/hw-transport';
  import { DeviceModel } from '@ledgerhq/devices';

  export default class TransportNodeHid extends Transport<string> {
    /**
     * List all available descriptors. For a better granularity, use `listen()`.
     *
     * @return {Promise<string[]>} All available descriptors.
     */
    public static list(): Promise<string[]>;

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
    public static listen(observer: Observer<DescriptorEvent<string>>): Subscription;

    /**
     * Attempt to create an instance of the Transport with the descriptor.
     *
     * @param {string} descriptor The descriptor to open the Transport with. If none provided, the
     *   first available device will be used.
     * @return {Promise<Transport<TransportNodeHid>} A Promise with the Transport instance.
     */
    public static open(descriptor?: string): Promise<TransportNodeHid>;

    public readonly device: any;
    public readonly deviceModel?: DeviceModel;
    public readonly channel: number;
    public readonly packetSize: number;
    public readonly disconnected: boolean;

    public constructor(device: USBDevice);

    /**
     * Not used by this specific Transport.
     */
    public setScramblekey(): void;
  }
}
