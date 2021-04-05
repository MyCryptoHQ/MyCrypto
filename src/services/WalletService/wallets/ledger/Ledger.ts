import EthereumApp from '@ledgerhq/hw-app-eth';
import Transport from '@ledgerhq/hw-transport';

import { LEDGER_DERIVATION_PATHS } from '@config/dpaths';
import { DWAccountDisplay, ExtendedDPath, WalletResult } from '@services';
import { DPath, TAddress, WalletId } from '@types';

import HardwareWallet, { KeyInfo } from '../HardwareWallet';
import { getFullPath } from '../helpers';
import { ledgerErrToMessage } from './helpers';

export default abstract class Ledger extends HardwareWallet {
  protected abstract transport: Transport<any> | null = null;
  protected abstract app: EthereumApp | null = null;

  public async initialize(dpath: DPath): Promise<void> {
    try {
      await this.checkConnection();

      // Fetch a random address to ensure the connection works
      await this.getAddress(dpath, 50);
    } catch (err) {
      throw ledgerErrToMessage(err.message);
    }
  }

  public getDPaths(): DPath[] {
    return LEDGER_DERIVATION_PATHS;
  }

  protected getWalletType(): WalletId.LEDGER_NANO_S_NEW {
    return WalletId.LEDGER_NANO_S_NEW;
  }

  protected abstract checkConnection(): Promise<void>;

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

  public async getMultipleAddresses(dpaths: ExtendedDPath[]): Promise<DWAccountDisplay[]> {
    if (dpaths.length === 0) {
      console.error('[getMultipleAddresses]: Derivation paths not found');
      return [];
    }
    const outputAddresses: DWAccountDisplay[] = [];
    for (const dpath of dpaths) {
      try {
        for (let idx = 0; idx < dpath.numOfAddresses; idx++) {
          const data = (await this.getAddress(dpath, idx + dpath.offset)) as WalletResult;
          const outputObject = {
            address: data.address as TAddress,
            pathItem: {
              path: data.path,
              baseDPath: dpath,
              index: idx + dpath.offset
            },
            balance: undefined
          };
          outputAddresses.push(outputObject);
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
        console.error('[getMultipleAddresses]: Error', e);
      }
    }
    return outputAddresses;
  }
}
