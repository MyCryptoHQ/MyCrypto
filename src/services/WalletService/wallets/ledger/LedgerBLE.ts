import EthereumApp from '@ledgerhq/hw-app-eth';
import { DescriptorEvent } from '@ledgerhq/hw-transport';
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble';

import Ledger from './Ledger';

type BluetoothDevice = any; // @todo

export default class LedgerBLE extends Ledger {
  protected transport: TransportWebBLE | null = null;
  protected app: EthereumApp | null = null;

  protected async checkConnection(): Promise<void> {
    if (this.transport === null) {
      this.transport = await this.getTransport();
      this.app = new EthereumApp(this.transport);
    }
  }

  private async getTransport(): Promise<TransportWebBLE> {
    const device = await this.getDevice();
    const transport = await TransportWebBLE.open(device);

    transport.on('disconnect', () => {
      this.transport = null;
    });

    return transport;
  }

  private getDevice(): Promise<BluetoothDevice> {
    return new Promise((resolve, reject) => {
      const subscription = TransportWebBLE.listen({
        next(event: DescriptorEvent<BluetoothDevice>): void {
          if (event.type === 'add') {
            subscription.unsubscribe();
            resolve(event.descriptor);
          }
        },
        error(error: any): void {
          reject(error);
        },
        complete(): void {
          // noop
        }
      });
    });
  }
}
