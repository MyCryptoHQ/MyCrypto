import TransportU2F from '@ledgerhq/hw-transport-u2f';
import EthereumApp from '@ledgerhq/hw-app-eth';
import Ledger from './Ledger';

/**
 * Ledger U2F based transport, used as a fallback when WebUSB is not supported.
 */
export default class LedgerU2F extends Ledger {
  protected transport: TransportU2F | null = null;
  protected app: EthereumApp | null = null;

  protected async checkConnection(): Promise<void> {
    if (this.transport === null) {
      this.transport = await this.getTransport();
      this.app = new EthereumApp(this.transport);
    }
  }

  private async getTransport(): Promise<TransportU2F> {
    return await TransportU2F.open();
  }
}
