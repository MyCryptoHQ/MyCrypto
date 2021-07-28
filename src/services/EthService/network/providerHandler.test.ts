import nock from 'nock';

import { fNetworks } from '@fixtures';
import { ProviderHandler } from '@services';
import { TAddress } from '@types';

describe('ProviderHandler', () => {
  describe('getTokenInformation', () => {
    nock.disableNetConnect();

    afterEach(() => {
      nock.cleanAll();
    });

    it('fetches token information for ERC-20 tokens', async () => {
      const provider = new ProviderHandler(fNetworks[0]);

      nock(/.*/)
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0xc4db43'
        }))
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result:
            '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034441490000000000000000000000000000000000000000000000000000000000'
        }))
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0x0000000000000000000000000000000000000000000000000000000000000012'
        }));

      await expect(
        provider.getTokenInformation('0x6b175474e89094c44da98b954eedeac495271d0f' as TAddress)
      ).resolves.toStrictEqual({
        symbol: 'DAI',
        decimals: 18
      });

      await expect(
        provider.getTokenInformation('0x0000000000000000000000000000000000000000' as TAddress)
      ).resolves.toBeUndefined();
    });
  });
});
