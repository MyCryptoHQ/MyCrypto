import { ProviderHandler } from './providerHandler';
import { UnlockToken } from '../contracts';

export class UnlockProtocolHandler extends ProviderHandler {
  /* Unlock Token Methods */
  public fetchUnlockKeyExpiration(address: string, lockAddress: string): Promise<number> {
    return this.client
      .call({
        to: this.requests.getUnlockKeyExpirationTime(address, lockAddress).params[0].to,
        data: this.requests.getUnlockKeyExpirationTime(address, lockAddress).params[0].data
      })
      .then(data => UnlockToken.keyExpirationTimestampFor.decodeOutput(data))
      .then(({ timestamp }) => parseInt(timestamp, 10));
  }
}
