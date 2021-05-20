import { call } from 'redux-saga-test-plan/matchers';
import { expectSaga, mockAppState } from 'test-utils';

import { ETHUUID, REPV1UUID, REPV2UUID } from '@config';
import { fAccounts, fAssets, fNetworks } from '@fixtures';
import { Asset, TUuid } from '@types';
import { bigify, bigify as mockBigify } from '@utils';

import { updateAccountAssets } from './account.slice';
import { fetchRates } from './rates.slice';
import { formatBalances, getBalances, scanTokensWorker } from './tokenScanning.sagas';
import { scanTokens, default as slice } from './tokenScanning.slice';

const { startTokenScan, finishTokenScan } = slice.actions;

jest.mock('../BalanceService', () => ({
  getTokenBalancesForAddresses: jest.fn().mockImplementation((assets: Asset[]) =>
    Promise.resolve({
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': assets.reduce(
        (acc, cur) => ({ ...acc, [cur.contractAddress!]: mockBigify(1000000000000000000) }),
        {}
      )
    })
  ),
  getBaseAssetBalancesForAddresses: jest.fn().mockImplementation(() =>
    Promise.resolve({
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': mockBigify(2000000000000000000)
    })
  )
}));

describe('scanTokensWorker()', () => {
  it('calls getTokens and puts result', () => {
    const result = {
      [fAccounts[0].uuid]: [
        { uuid: REPV1UUID, balance: '1000000000000000000' },
        {
          uuid: REPV2UUID,
          balance: '1000000000000000000'
        },
        {
          uuid: ETHUUID as TUuid,
          balance: '2000000000000000000'
        }
      ]
    };
    const assets = [fAssets[10], fAssets[11]];
    return expectSaga(scanTokensWorker, scanTokens({}))
      .withState(mockAppState({ networks: fNetworks, assets, accounts: fAccounts }))
      .provide([[call.fn(fetchRates), {}]])
      .put(startTokenScan())
      .call(getBalances, fNetworks, fAccounts, assets)
      .put(updateAccountAssets(result))
      .call(fetchRates)
      .put(finishTokenScan())
      .silentRun();
  });

  it('updates only passed assets', () => {
    const result = {
      [fAccounts[0].uuid]: [
        {
          uuid: REPV2UUID,
          balance: '1000000000000000000'
        },
        {
          uuid: ETHUUID as TUuid,
          balance: '2000000000000000000'
        },
        fAccounts[0].assets[1]
      ]
    };
    const assets = [fAssets[0], fAssets[11]];
    return expectSaga(scanTokensWorker, scanTokens({ assets }))
      .withState(mockAppState({ networks: fNetworks, accounts: fAccounts }))
      .provide([[call.fn(fetchRates), {}]])
      .put(startTokenScan())
      .call(getBalances, fNetworks, fAccounts, assets)
      .put(updateAccountAssets(result))
      .call(fetchRates)
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
          balance: '1000000000000000000'
        },
        {
          uuid: ETHUUID as TUuid,
          balance: '2000000000000000000'
        },
        fAccounts[0].assets[1]
      ]
    });
  });
});
