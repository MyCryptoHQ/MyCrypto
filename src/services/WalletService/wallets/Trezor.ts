import TrezorConnect from 'trezor-connect';

import { DPathsList, TREZOR_DERIVATION_PATHS } from '@config/dpaths';
import { WalletId } from '@types';

import HardwareWallet, { KeyInfo } from './HardwareWallet';
import { getFullPath } from './helpers';

export default class Trezor extends HardwareWallet {
  private cache: { [key: string]: KeyInfo } = {};

  public async initialize(): Promise<void> {
    TrezorConnect.manifest({
      email: 'support@mycrypto.com',
      appUrl: 'https://beta.mycrypto.com'
    });

    this.cache = {};

    // Fetch a random address to ensure the connection works
    await this.getAddress(DPathsList.ETH_DEFAULT, 50);
  }

  public async prefetch(paths: DPath[]): Promise<{ [key: string]: KeyInfo }> {
    const bundle = paths.filter((path) => !path.isHardened).map((path) => ({ path: path.value }));

    const response: any = await TrezorConnect.getPublicKey({ bundle }); // @todo - figure out these types

    for (const { serializedPath, chainCode, publicKey } of response.payload) {
      this.cache[serializedPath] = { chainCode, publicKey };
    }

    return this.cache;
  }

  public getDPaths(): DPath[] {
    return TREZOR_DERIVATION_PATHS;
  }

  protected getWalletType(): WalletId.TREZOR_NEW {
    return WalletId.TREZOR_NEW;
  }

  protected async getKeyInfo(path: DPath): Promise<KeyInfo> {
    if (this.cache[path.value]) {
      return this.cache[path.value];
    }

    const response = await TrezorConnect.getPublicKey({ path: path.value });

    return {
      publicKey: response.payload.publicKey,
      chainCode: response.payload.chainCode
    };
  }

  protected async getHardenedAddress(path: DPath, index: number): Promise<string> {
    /**
     * @todo: Add support for getting multiple addresses at the same time. For reference:
     * https://github.com/trezor/connect/blob/develop/docs/methods/ethereumGetAddress.md
     */
    const response = await TrezorConnect.ethereumGetAddress({ path: getFullPath(path, index) });

    return response.payload.address;
  }
}
