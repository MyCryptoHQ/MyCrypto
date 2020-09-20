import EthereumApp from '@ledgerhq/hw-app-eth';
import Transport from '@ledgerhq/hw-transport';
import { createTransportReplayer, RecordStore } from '@ledgerhq/hw-transport-mocker';

import Ledger from '../Ledger';

export default class LedgerUSB extends Ledger {
  protected transport: Transport<any> | null = null;
  protected app: EthereumApp | null = null;

  public constructor(public readonly store: RecordStore) {
    super();
    this.store = store;
  }

  protected async checkConnection(): Promise<void> {
    if (this.transport === null) {
      this.transport = await this.getTransport();
      this.app = new EthereumApp(this.transport);
    }
  }

  private async getTransport(): Promise<Transport<any>> {
    const ReplayTransport = createTransportReplayer(this.store);
    const transport = new ReplayTransport();

    transport.on('disconnect', () => {
      this.transport = null;
    });

    return transport;
  }
}
