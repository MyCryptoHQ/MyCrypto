import swap from '@assets/images/transactions/swap.svg';
import { fAssets } from '@fixtures';
import { translateRaw } from '@translations';

import { constructTxTypeConfig } from './helpers';

describe('constructTxTypeConfig', () => {
  test('correctly handles action type to determine label', () => {
    const type = 'GENERIC_CONTRACT_CALL';
    const protocol = '';
    const result = constructTxTypeConfig({ type, protocol });
    const expectedLabel = translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT', {
      $ticker: fAssets[0].ticker
    });
    expect(result.label(fAssets[0])).toEqual(expectedLabel);
  });
  test('correctly handles action to determine derived tx label', () => {
    const type = 'EXCHANGE';
    const protocol = 'UNISWAP_V1';
    const result = constructTxTypeConfig({ type, protocol });
    const expectedLabel = 'Uniswap v1: Assets Swapped';
    expect(result.label(fAssets[0])).toBe(expectedLabel);
  });

  test('correctly handles action to determine icon type', () => {
    const type = 'EXCHANGE';
    const protocol = 'UNISWAP_V1';
    const result = constructTxTypeConfig({ type, protocol });
    expect(result.icon()).toBe(swap);
  });
});
