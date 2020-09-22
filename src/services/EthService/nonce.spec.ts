import { fNetwork as Ropsten } from '@fixtures';
import { TAddress } from '@types';

import { ProviderHandler } from './network';
import { getNonce } from './nonce';

const mockGetTransaction = (value: number, target: typeof ProviderHandler) => {
  target.prototype.getTransactionCount = ProviderHandler.prototype.getTransactionCount = jest
    .fn()
    .mockResolvedValueOnce(value);
};

describe('getNonce()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Returns the number of transactions for an address', async () => {
    const res = 300;
    mockGetTransaction(res, ProviderHandler);
    const nonce = await getNonce(Ropsten, '0xd31C31005E331BA54508A5c1caC50341a5121E9F' as TAddress);
    expect(nonce).toEqual(res);
  });
});
