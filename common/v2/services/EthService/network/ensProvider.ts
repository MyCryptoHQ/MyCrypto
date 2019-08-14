import { ProviderHandler } from './providerHandler';

export class ENSProvider extends ProviderHandler {
  public resolveENS(name: string): Promise<string | null> {
    return this.client.resolveName(name);
  }
  public lookupENS(address: string): Promise<string | undefined> {
    return this.client.lookupAddress(address);
  }
}
