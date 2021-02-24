import { expectSaga, mockAppState } from 'test-utils';

import { ETHUUID, REPV2UUID } from '@config';
import { fAccounts, fAssets, fNetworks } from '@fixtures';
import { TUuid } from '@types';
import { bigify, bigify as mockBigify } from '@utils';

import { updateAccountAssets } from './account.slice';
import {
  formatBalances,
  getBalances,
  initialState,
  scanTokens,
  scanTokensWorker,
  default as slice
} from './tokenScanning.slice';

const reducer = slice.reducer;
const { startTokenScan, finishTokenScan } = slice.actions;

describe('Token Scanning Slice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('startTokenScan(): sets scanning state to true', () => {
    const actual = reducer(initialState, startTokenScan);
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
  getTokenBalancesForAddresses: jest.fn().mockImplementation(() =>
    Promise.resolve({
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': {
        '0x221657776846890989a759BA2973e427DfF5C9bB': mockBigify(1000000000000000000)
      }
    })
  ),
  getBaseAssetBalancesForAddresses: jest.fn().mockImplementation(() =>
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
      .withState(mockAppState({ networks: fNetworks, assets: fAssets, accounts: fAccounts }))
      .put(startTokenScan())
      .call(getBalances, fNetworks, fAccounts, fAssets)
      .put(updateAccountAssets(result))
      .put(finishTokenScan())
      .silentRun();
  });
});

describe('formatBalances()', () => {
  it('correctly generates asset balance objects from balance maps', () => {
    const input = {
      network: fNetworks[0],
      tokenBalances: {
        '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': {
          '0x221657776846890989a759BA2973e427DfF5C9bB': bigify(1000000000000000000),
          '0x221657776846890989a759BA2973e427DfF5C9bA': bigify(1000000000000000000)
        }
      },
      baseAssetBalances: {
        '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': bigify(2000000000000000000)
      }
    };
    const result = formatBalances(fAssets, fAccounts)(input);
    expect(result).toEqual({
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
    });
  });
});
