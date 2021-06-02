import EthereumApp from '@ledgerhq/hw-app-eth';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';

import Ledger from './Ledger';

export default class LedgerUSB extends Ledger {
  protected transport: TransportWebHID | null = null;
  protected app: EthereumApp | null = null;

  protected async checkConnection(): Promise<void> {
    if (this.transport === null) {
      this.transport = await this.getTransport();
      this.app = new EthereumApp(this.transport);
    }
  }

  private async getTransport(): Promise<TransportWebHID> {
    const transport = await TransportWebHID.request();

    transport.on('disconnect', () => {
      this.transport = null;
    });

    return transport;
  }
}
