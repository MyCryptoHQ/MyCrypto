declare module '@ledgerhq/hw-transport-web-ble' {
  import { DeviceModel } from '@ledgerhq/devices';
  import Transport, { DescriptorEvent, Observer, Subscription } from '@ledgerhq/hw-transport';
  import { Observable } from 'rxjs';

  export default class TransportWebBLE extends Transport<BluetoothDevice | string> {
    /**
     * Observe events, an event is emitted once, and then each time it changes.
     *
     * @param {Observer<DescriptorEvent<BluetoothDevice>>} observer The observer.
     */
    public static observeAvailability(observer: Observer<DescriptorEvent<BluetoothDevice>>): void;

    /**
     * Does not return anything for this specific Transport.
     */
    public static list(): Promise<never[]>;

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
    public static listen(observer: Observer<DescriptorEvent<BluetoothDevice>>): Subscription;

    /**
     * Attempt to create an instance of the Transport with the descriptor.
     *
     * @param {BluetoothDevice | string} descriptor The descriptor to open the Transport with.
     * @return {Promise<Transport<TransportWebBLE>} A Promise with the Transport instance.
     */
    public static open(descriptor: BluetoothDevice | string): Promise<TransportWebBLE>;

    /**
     * Open the first descriptor available or throw if there is none, or if the timeout is reached.
     *
     * @param {number} openTimeout The optional open timeout.
     * @param {number} listenTimeout The optional listen timeout.
     */
    public static create(openTimeout?: number, listenTimeout?: number): Promise<TransportWebBLE>;

    /**
     * Disconnect a Bluetooth device by its ID.
     *
     * @param {string} id The ID of the Bluetooth device.
     * @return {Promise<void>}
     */
    public static disconnect(id: string): Promise<void>;

    public id: string;
    public device: BluetoothDevice;
    public mtuSize: number;
    public writeCharacteristic: BluetoothRemoteGATTCharacteristic;
    public notifyObservable: Observable<Buffer>;
    public notYetDisconnected: boolean;
    public deviceModel: DeviceModel;

    /**
     * Create a new instance of the transport. It's recommended to use either `open()` or `create()`
     * instead.
     *
     * @param {BluetoothDevice} device
     * @param {BluetoothRemoteGATTCharacteristic }writeCharacteristic
     * @param {Observable<Buffer>} notifyObservable
     * @param {DeviceModel} deviceModel
     */
    public constructor(
      device: BluetoothDevice,
      writeCharacteristic: BluetoothRemoteGATTCharacteristic,
      notifyObservable: Observable<Buffer>,
      deviceModel: DeviceModel
    );

    public inferMTU(): Promise<number>;

    /**
     * Not used by this specific Transport.
     */
    public setScramblekey(): void;
  }
}
