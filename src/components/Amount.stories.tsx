import React from 'react';

import { fAsset } from '@../jest_config/__fixtures__/assets';

import { Fiats } from '@config';

import AmountComponent from './Amount';

const props = {
  assetValue: '0.043',
  fiat: {
    amount: '230',
    symbol: Fiats['USD'].symbol,
    ticker: Fiats['USD'].ticker
  }
};

export default {
  title: 'Molecules/Amount',
  component: AmountComponent
};

const Template = (args: React.ComponentProps<typeof AmountComponent>) => (
  <AmountComponent {...args} />
);

export const Default = Template.bind({});
Default.storyName = 'Default';
Default.args = {
  ...props,
  bold: true,
  baseAssetValue: '0.043'
};

export const WithIcon = Template.bind({});
WithIcon.storyName = 'WithIcon';
WithIcon.args = {
  fiat: props.fiat,
  asset: {
    amount: props.assetValue,
    ticker: fAsset.ticker,
    uuid: fAsset.uuid
  }
};

export const LeftAlign = Template.bind({});
LeftAlign.storyName = 'LeftAlign';
LeftAlign.args = {
  ...props,
  baseAssetValue: '0.043',
  alignLeft: true
};
