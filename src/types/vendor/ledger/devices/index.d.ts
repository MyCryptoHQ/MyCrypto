declare module '@ledgerhq/devices' {
  export const IIGenericHID: number;
  export const IIKeyboardHID: number;
  export const IIU2F: number;
  export const IICCID: number;
  export const IIWebUSB: number;

  export interface DeviceModel {
    id: string;
    productName: string;
    productIdMM: number;
    legacyUsbProductId: number;
    usbOnly: boolean;
    bluetoothSpec?: {
      serviceUuid: string;
      notifyUuid: string;
      writeUuid: string;
    }[];
  }

  interface Blue extends DeviceModel {
    id: 'blue';
    productName: 'Ledger Blue';
    productIdMM: 0;
    legacyUsbProductId: 0x0000;
    usbOnly: true;
  }

  interface NanoS extends DeviceModel {
    id: 'nanoS';
    productName: 'Ledger Nano S';
    productIdMM: 1;
    legacyUsbProductId: 0x0001;
    usbOnly: true;
  }

  interface NanoX extends DeviceModel {
    id: 'nanoX';
    productName: 'Ledger Nano X';
    productIdMM: 4;
    legacyUsbProductId: 0x0004;
    usbOnly: false;
    bluetoothSpec: [
      // Legacy (prototype) version
      {
        serviceUuid: 'd973f2e0-b19e-11e2-9e96-0800200c9a66';
        notifyUuid: 'd973f2e1-b19e-11e2-9e96-0800200c9a66';
        writeUuid: 'd973f2e2-b19e-11e2-9e96-0800200c9a66';
      },
      {
        serviceUuid: '13d63400-2c97-0004-0000-4c6564676572';
        notifyUuid: '13d63400-2c97-0004-0001-4c6564676572';
        writeUuid: '13d63400-2c97-0004-0002-4c6564676572';
      }
    ];
  }

  export type DeviceModelId = Blue | NanoS | NanoX;
}
