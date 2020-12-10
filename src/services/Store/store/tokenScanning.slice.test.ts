import { expectSaga } from 'test-utils';

import { ETHUUID, REPV2UUID } from '@config';
import { fAccounts, fAssets, fNetworks } from '@fixtures';
import { TUuid } from '@types';
import { bigify as mockBigify } from '@utils';

import { updateAccountAssets } from './account.slice';
import { getTokens, initialState, scanTokensWorker, default as slice } from './tokenScanning.slice';

const reducer = slice.reducer;
const { scanTokens, finishTokenScan } = slice.actions;

describe('Token Scanning Slice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('scanTokens(): sets scanning state to true', () => {
    const actual = reducer(initialState, scanTokens);
    const expected = { scanning: true };
    expect(actual).toEqual(expected);
  });

  it('finishTokenScan(): sets scanning state to false', () => {
    const actual = reducer(initialState, finishTokenScan);
    const expected = { scanning: false };
    expect(actual).toEqual(expected);
  });
});

jest.mock('../BalanceService', () => ({
  getAllTokensBalancesOfAccounts: jest.fn().mockImplementation(() =>
    Promise.resolve({
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': {
        '0x221657776846890989a759BA2973e427DfF5C9bB': mockBigify(1000000000000000000)
      }
    })
  ),
  getBaseAssetBalances: jest.fn().mockImplementation(() =>
    Promise.resolve({
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': mockBigify(2000000000000000000)
    })
  )
}));

Date.now = jest.fn(() => 1607602775360);

describe('scanTokensWorker()', () => {
  it('calls getTokens and puts result', () => {
    const result = {
      [fAccounts[0].uuid]: [
        {
          uuid: REPV2UUID,
          balance: '1000000000000000000',
          mtime: 1607602775360
        },
        {
          uuid: ETHUUID as TUuid,
          balance: '2000000000000000000',
          mtime: 1607602775360
        },
        fAccounts[0].assets[1]
      ]
    };
    return expectSaga(scanTokensWorker, scanTokens({}))
      .withState({ legacy: { networks: fNetworks, assets: fAssets, accounts: fAccounts } })
      .call(getTokens, fNetworks, fAccounts, fAssets)
      .put(updateAccountAssets(result))
      .put(finishTokenScan())
      .silentRun();
  });
});
