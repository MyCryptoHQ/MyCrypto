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

  describe('isValidEIP1271Signature', () => {
    nock.disableNetConnect();

    afterEach(() => {
      nock.cleanAll();
    });

    it('checks whether a signature is valid using EIP1271', async () => {
      const provider = new ProviderHandler(fNetworks[0]);

      nock(/.*/)
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0x1626ba7e00000000000000000000000000000000000000000000000000000000'
        }));

      await expect(
        provider.isValidEIP1271Signature({
          address: '0x14987eb8d2553B3dfBe7B72AC5e062392E044644',
          msg: 'testing with argent',
          sig:
            '0x0fe68c13c9f7cf89c565bce2f4930bd5aa0adf406c4edf0205a794e10c085ee36293abb9469f243d6438cada470f843c3f5bb1d9778af8465bbb7221da8e28de1b',
          version: '2'
        })
      ).resolves.toBe(true);
    });

    it('returns false in case of errors', async () => {
      const provider = new ProviderHandler(fNetworks[0]);

      nock(/.*/)
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          error: {
            code: 3,
            message: 'execution reverted: TM: Invalid signer',
            data:
              '0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012544d3a20496e76616c6964207369676e65720000000000000000000000000000'
          }
        }));

      await expect(
        provider.isValidEIP1271Signature({
          address: '0x14987eb8d2553B3dfBe7B72AC5e062392E044644',
          msg: 'bla',
          sig:
            '0x0fe68c13c9f7cf89c565bce2f4930bd5aa0adf406c4edf0205a794e10c085ee36293abb9469f243d6438cada470f843c3f5bb1d9778af8465bbb7221da8e28de1b',
          version: '2'
        })
      ).resolves.toBe(false);
    });
  });
});
