import { ProviderHandler } from './providerHandler';
import { UnlockToken } from '../contracts';

export class UnlockProtocolHandler extends ProviderHandler {
  /* Unlock Token Methods */
  public fetchUnlockKeyExpiration(address: string, lockAddress: string): Promise<number> {
    const request = this.requests.getUnlockKeyExpirationTime(address, lockAddress).params[0];
    return this.injectClient((client) =>
      client
        .call({
          to: request.to,
          data: request.data
        })
        .then((data) => UnlockToken.keyExpirationTimestampFor.decodeOutput(data))
        .then(({ timestamp }) => parseInt(timestamp, 10))
    );
  }
}
