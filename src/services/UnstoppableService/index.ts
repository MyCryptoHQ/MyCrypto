import Resolution, { ResolutionErrorCode } from '@unstoppabledomains/resolution';
import { MYC_API_MAINNET } from '@config/constants';

class UnstoppableResolution {
  private resolution: Resolution;

  constructor() {
    this.resolution = new Resolution({
      blockchain: {
        ens: { url: MYC_API_MAINNET, network: 'mainnet' },
        cns: { url: MYC_API_MAINNET, network: 'mainnet' }
      }
    });
  }

  public async getResolvedAddress(domain: string, currencyTicker: string): Promise<string> {
    return await this.resolution.addressOrThrow(domain, currencyTicker);
  }

  public isValidDomain(domain: string): boolean {
    return this.resolution.isSupportedDomain(domain);
  }

  public isResolutionError(err: any) {
    return err && Object.values(ResolutionErrorCode).includes(err.code);
  }
}

export default new UnstoppableResolution();
