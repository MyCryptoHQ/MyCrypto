import Resolution, { ResolutionErrorCode } from '@unstoppabledomains/resolution';

const resolution = new Resolution({
  blockchain: {
    ens: { url: 'https://api.mycryptoapi.com/eth', network: 'mainnet' },
    cns: { url: 'https://api.mycryptoapi.com/eth', network: 'mainnet' }
  }
});

class UnstoppableResolution {
  public async getResolvedAddress(domain: string, currencyTicker: string): Promise<string> {
    return await resolution.addressOrThrow(domain, currencyTicker);
  }

  public isValidDomain(domain: string): boolean {
    return resolution.isSupportedDomain(domain);
  }

  public isResolutionError(err: any) {
    return err && Object.values(ResolutionErrorCode).includes(err.code);
  }
}

export default UnstoppableResolution;
