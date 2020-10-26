import EthereumApp from '@ledgerhq/hw-app-eth';
import Transport from '@ledgerhq/hw-transport';

import { DPathsList, LEDGER_DERIVATION_PATHS } from '@config/dpaths';
import { DPath, WalletId } from '@types';

import HardwareWallet, { KeyInfo } from '../HardwareWallet';
import { getFullPath } from '../helpers';

export default abstract class Ledger extends HardwareWallet {
  protected abstract transport: Transport<any> | null = null;
  protected abstract app: EthereumApp | null = null;

  public async initialize(): Promise<void> {
    await this.checkConnection();

    // Fetch a random address to ensure the connection works
    await this.getAddress(DPathsList.ETH_LEDGER, 50);
  }

  public getDPaths(): DPath[] {
    return LEDGER_DERIVATION_PATHS;
  }

  protected getWalletType(): WalletId.LEDGER_NANO_S_NEW {
    return WalletId.LEDGER_NANO_S_NEW;
  }

  protected abstract async checkConnection(): Promise<void>;

  protected async getKeyInfo(dPath: DPath): Promise<KeyInfo> {
    await this.checkConnection();

    const response = await this.app!.getAddress(dPath.value, false, true);
    return {
      publicKey: response.publicKey,
      chainCode: response.chainCode!
    };
  }

  protected async getHardenedAddress(dPath: DPath, index: number): Promise<string> {
    await this.checkConnection();

    const response = await this.app!.getAddress(getFullPath(dPath, index));

    return response.address;
  }
}
