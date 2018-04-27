import LedgerTransport, { Observer, DescriptorEvent } from 'ledgerhq__hw-transport';
import { HID, Device } from 'node-hid';

type ObserverEvents = {} | {} | {};
declare module 'ledgerhq__hw-transport-node-hid' {
  export default class TransportNodeHid extends LedgerTransport<string> {
    /**
     * Creates an instance of TransportNodeHid.
     * @param {HID} device
     * @param {boolean} [ledgerTransport]
     * @param {number} [timeout]
     * @param {boolean} [debug]
     * @memberof TransportNodeHid
     */
    constructor(device: HID, ledgerTransport?: boolean, timeout?: number, debug?: boolean);

    /**
     *
     * @description Check if an HID instance is active
     * @static
     * @returns {Promise<boolean>}
     * @memberof TransportNodeHid
     */
    public static isSupported(): Promise<boolean>;

    /**
     *
     * @description Lists all available HID device's paths
     * @static
     * @returns {Promise<string[]>}
     * @memberof TransportNodeHid
     */
    public static list(): Promise<Device['path'][]>;

    public static listen(observer: Observer<DescriptorEvent<string, HID>, Device['path']>);
  }
}
