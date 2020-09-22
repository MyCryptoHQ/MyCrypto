import { TTicker } from '@types';

import isFiatTicker from './isFiatTicker';

it('returns true for a valid fiat ticker', () => {
  expect(isFiatTicker('USD' as TTicker)).toEqual(true);
});

it('returns false for an Asset ticker', () => {
  expect(isFiatTicker('ETH' as TTicker)).toEqual(false);
});
