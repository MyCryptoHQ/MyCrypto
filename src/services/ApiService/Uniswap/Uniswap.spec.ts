import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { fAccount, fNetwork } from '@fixtures';
import { ITxValue } from '@types';

import { UniswapService } from '.';
import { ClaimState } from './Uniswap';

jest.mock('@vendor', () => ({
  ...jest.requireActual('@vendor'),
  // Mock return value of isClaimed()
  FallbackProvider: jest.fn().mockImplementation(() => ({
    call: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve('0x0000000000000000000000000000000000000000000000000000000000000001')
      )
  }))
}));

const mockClaim = {
  [fAccount.address]: {
    Amount: '0x15af1d78b58c400000' as ITxValue,
    Flags: { IsSOCKS: false, ISLP: false, IsUser: true },
    Index: 102925
  }
};

describe('UniswapService', () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it('can get claims', async () => {
    const addresses = [fAccount.address];
    const claims = UniswapService.instance.getClaims(addresses);

    await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith('', { addresses }));

    mockAxios.mockResponse({
      data: { claims: mockClaim }
    });

    const result = await claims;
    expect(result).toBe(mockClaim);
  });

  it('can check whether claims are still valid', async () => {
    const claims = await UniswapService.instance.isClaimed(fNetwork, mockClaim);
    expect(claims).toStrictEqual([
      {
        address: fAccount.address,
        state: ClaimState.CLAIMED,
        amount: mockClaim[fAccount.address].Amount
      }
    ]);
  });
});
