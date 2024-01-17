import { DEFAULT_EVRICE } from '@mycrypto/wallets';
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

  describe('resolveName', () => {
    nock.disableNetConnect();

    afterEach(() => {
      nock.cleanAll();
    });

    it('resolves an ENS name on Ethereum', async () => {
      const provider = new ProviderHandler(fNetworks[0]);

      nock(/.*/)
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0x0000000000000000000000004976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41'
        }))
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0x0000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa261520'
        }));

      await expect(provider.resolveName('mycrypto.eth')).resolves.toBe(
        '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
      );
    });

    it('returns null if no resolver found', async () => {
      const provider = new ProviderHandler(fNetworks[0]);

      nock(/.*/)
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0x0000000000000000000000000000000000000000000000000000000000000000'
        }));

      await expect(provider.resolveName('mycrypto.eth')).resolves.toBeNull();
    });

    it('resolves an ENS name with a different coinType', async () => {
      const provider = new ProviderHandler(fNetworks[0]);

      nock(/.*/)
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0x0000000000000000000000004976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41'
        }))
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result:
            '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000014983110309620d911731ac0932219af06091b6744000000000000000000000000'
        }));

      await expect(provider.resolveName('brantly.eth', fNetworks[2])).resolves.toBe(
        '0x983110309620D911731Ac0932219af06091b6744'
      );
    });

    it('falls back to ETH name if different coinType doesnt resolve', async () => {
      const provider = new ProviderHandler(fNetworks[0]);

      nock(/.*/)
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0x0000000000000000000000004976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41'
        }))
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result:
            '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000014983110309620d911731ac0932219af06091b6744000000000000000000000000'
        }))
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result: '0x000000000000000000000000983110309620d911731ac0932219af06091b6744'
        }));

      await expect(
        provider.resolveName('brantly.eth', {
          ...fNetworks[2],
          dPaths: { default: DEFAULT_EVRICE }
        })
      ).resolves.toBe('0x983110309620D911731Ac0932219af06091b6744');
    });

    it('resolves an UD name on Ethereum', async () => {
      const provider = new ProviderHandler(fNetworks[0]);

      nock(/.*/)
        .post(/.*/)
        .reply(200, () => ({
          id: 1,
          jsonrpc: '2.0',
          result:
            '0x000000000000000000000000b66dce2da6afaaa98f2013446dbcb0f4b0ab28420000000000000000000000008aad44321a86b170879d7a244c1e8d360c99dda8000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002a30783861614434343332314138366231373038373964374132343463316538643336306339394464413800000000000000000000000000000000000000000000'
        }));
      await expect(provider.resolveName('brad.crypto')).resolves.toBe(
        '0x8aaD44321A86b170879d7A244c1e8d360c99DdA8'
      );
    });
  });
});
