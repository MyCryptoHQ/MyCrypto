import React from 'react';

import { DAIUUID, ETHUUID } from '@config';
import { fAssets, fSettings } from '@fixtures';
import { ISwapAsset, TTicker, TUuid } from '@types';
import { bigify, noOp } from '@utils';

import { SwapQuote } from './SwapQuote';

const DAI: ISwapAsset = {
  name: 'DAI Stablecoin v2.0',
  ticker: 'DAI' as TTicker,
  uuid: DAIUUID as TUuid
};
const ETH: ISwapAsset = {
  name: 'Ethereum',
  ticker: 'ETH' as TTicker,
  uuid: ETHUUID as TUuid
};
const defaultProps = {
  exchangeRate: 123.123,
  fromAsset: ETH,
  fromAssetRate: 0.123,
  toAsset: DAI,
  fromAmount: bigify('0.5'),
  toAmount: bigify('100'),
  baseAsset: fAssets[0],
  baseAssetRate: bigify('123'),
  settings: fSettings,
  isExpired: false,
  expiration: Date.now(),
  estimatedGasFee: '123123',
  handleRefreshQuote: noOp
};

export default { title: 'Organisms/SwapQuote', component: SwapQuote };

const Template = (args: React.ComponentProps<typeof SwapQuote>) => {
  return <SwapQuote {...args} />;
};

export const Hello = Template.bind({});
Hello.storyName = 'SwapQuote';
Hello.args = {
  ...defaultProps
};
