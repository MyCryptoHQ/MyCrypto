import MyCryptoProvider from './providerHandler';

export class ENSProvider extends MyCryptoProvider {
  public resolveENS(name: string): Promise<string | null> {
    return this.client.resolveName(name);
  }
  public lookupENS(address: string): Promise<string | undefined> {
    return this.client.lookupAddress(address);
  }
}

// this is already provided in Ethers, no need to wrap function if you're just going to call the function
