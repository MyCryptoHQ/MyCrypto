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

  private async openTransport(): Promise<TransportWebHID> {
    const list = await TransportWebHID.list();
    if (list.length > 0 && list[0].opened) {
      return new TransportWebHID(list[0]);
    }

    const existing = await TransportWebHID.openConnected().catch(() => null);
    return existing ?? TransportWebHID.request();
  }

  private async getTransport(): Promise<TransportWebHID> {
    const transport = await this.openTransport();

    transport.on('disconnect', () => {
      this.transport = null;
    });

    return transport;
  }
}
