import { IFrameEthereumProvider, isEmbeddedInIFrame } from '@ethvault/iframe-provider';
import { IFullWallet } from '../IWallet';

export default class IFrameWallet implements IFullWallet {
  public readonly isReadOnly: false = false;

  private readonly provider: IFrameEthereumProvider;
  private readonly address: string;

  constructor(address: string) {
    this.address = address;

    if (isEmbeddedInIFrame()) {
      this.provider = new IFrameEthereumProvider();
    } else {
      throw new Error('Not embedded in an iframe.');
    }
  }

  public getAddressString(): string {
    return this.address;
  }

  public signMessage(msg: string): Promise<string> {
    return this.provider.send('eth_sign', [ this.getAddressString(), msg ]);
  }

  public signRawTransaction(): Promise<Buffer> | Buffer {
    return Promise.reject(new Error('Web3 wallets cannot sign raw transactions.'));
  }
}
