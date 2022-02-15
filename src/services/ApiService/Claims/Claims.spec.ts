import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { UNISWAP_UNI_CLAIM_API } from '@config';
import { fAccount, fNetwork } from '@fixtures';
import { ClaimState, ClaimType, ITxValue } from '@types';
import { bigify, hexlify } from '@utils';

import { ClaimsService } from '.';

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

describe('ClaimsService', () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it('can get claims', async () => {
    const addresses = [fAccount.address];
    const claims = ClaimsService.instance.getClaims(ClaimType.UNI, addresses);

    await waitFor(() =>
      expect(mockAxios.post).toHaveBeenCalledWith(
        '',
        { addresses },
        { baseURL: UNISWAP_UNI_CLAIM_API }
      )
    );

    mockAxios.mockResponse({
      data: { claims: mockClaim }
    });

    const result = await claims;
    expect(result).toBe(mockClaim);
  });

  it('can check whether claims are still valid', async () => {
    const claims = await ClaimsService.instance.isClaimed(fNetwork, ClaimType.UNI, mockClaim);
    expect(claims).toStrictEqual([
      {
        address: fAccount.address,
        state: ClaimState.CLAIMED,
        index: 102925,
        amount: mockClaim[fAccount.address].Amount
      }
    ]);
  });

  it('can process amounts if needed', async () => {
    const claims = await ClaimsService.instance.isClaimed(fNetwork, ClaimType.GIV, mockClaim);
    expect(claims).toStrictEqual([
      {
        address: fAccount.address,
        state: ClaimState.CLAIMED,
        index: 102925,
        amount: hexlify(bigify(mockClaim[fAccount.address].Amount).div(10))
      }
    ]);
  });
});
